import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../auth/[...nextauth]/route";
import UserModel from "@/models/user-model";
import HttpError from "@/models/http-error";

export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session) {
      throw new HttpError("Session Not Found", 401);
    }

    const allUsers = await UserModel.find({
      _id: { $ne: session.user?.id },
    })
      .select("name profilePicUrl")
      .lean();

    return NextResponse.json(
      { message: "Connections retrieved successfully", users: allUsers },
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
