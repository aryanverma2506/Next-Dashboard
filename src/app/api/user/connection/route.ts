import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../auth/[...nextauth]/route";
import HttpError from "@/models/http-error";
import UserModel from "@/models/user-model";
import redis from "@/lib/redis";

export async function PUT(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session) {
      throw new HttpError("Session Not Found", 401);
    }

    const { userId } = await req.json();

    if (session.user?.id === userId) {
      throw new HttpError("You cannot add yourself in the connection", 400);
    }

    const operations = [
      {
        updateOne: {
          filter: {
            $and: [{ _id: session.user?.id }, { connections: { $ne: userId } }],
          },
          update: { $addToSet: { connections: userId } },
        },
      },
      {
        updateOne: {
          filter: {
            $and: [{ _id: userId }, { connections: { $ne: session.user?.id } }],
          },
          update: { $addToSet: { connections: session.user?.id } },
        },
      },
    ];

    const oldConnectedUser = (await UserModel.findOne({ _id: userId })
      .select({
        _id: 0,
        email: 1,
      })
      .lean()) as Record<string, string>;

    await redis.del(session.user?.email);
    oldConnectedUser && (await redis.del(oldConnectedUser.email));

    const result = await UserModel.bulkWrite(operations, { ordered: false });

    if (result.modifiedCount < 2) {
      throw new HttpError("User already added or user not found", 400);
    }

    return NextResponse.json(
      {
        message: "User successfully added in connections!",
        userId: userId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: error.statusCode }
      );
    } else {
      console.error(error);
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session) {
      throw new HttpError("Session Not Found", 401);
    }

    const { userId } = await req.json();

    if (session.user?.id === userId) {
      throw new HttpError("You cannot add yourself in the connection", 400);
    }

    const operations = [
      {
        updateOne: {
          filter: {
            $and: [{ _id: session.user?.id }, { connections: userId }],
          },
          update: { $pull: { connections: userId } },
        },
      },
      {
        updateOne: {
          filter: {
            $and: [{ _id: userId }, { connections: session.user?.id }],
          },
          update: { $pull: { connections: session.user?.id } },
        },
      },
    ];

    const newConnectedUser = (await UserModel.findOne({ _id: userId })
      .select({
        _id: 0,
        email: 1,
      })
      .lean()) as Record<string, string>;

    await redis.del(session.user?.email);
    newConnectedUser && (await redis.del(newConnectedUser.email));

    const result = await UserModel.bulkWrite(operations, { ordered: false });

    if (result.modifiedCount === 0) {
      throw new HttpError("User is not in your connections", 400);
    }

    return NextResponse.json(
      { message: "User removed successfully!", userId: userId },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: error.statusCode }
      );
    } else {
      console.error(error);
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
}
