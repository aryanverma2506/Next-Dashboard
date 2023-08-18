import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { extractPublicId } from "cloudinary-build-url";

import redis from "@/lib/redis";
import UserModel from "@/models/user-model";
import HttpError from "@/models/http-error";
import cloudinary from "@/lib/cloudinary";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session) {
      throw new HttpError("Session Not Found", 401);
    }

    const cachedUserData = await redis.get(session.user?.email);

    if (cachedUserData) {
      const { password: _, ...userWithoutPassword } =
        JSON.parse(cachedUserData);
      return NextResponse.json(
        { message: "Profile fetched successfully", user: userWithoutPassword },
        { status: 200 }
      );
    }

    const existingUserObject = (await UserModel.findById(
      session.user.id
    ).lean()) as any;

    if (!existingUserObject) {
      throw new HttpError("User Not found!", 404);
    }

    redis.set(existingUserObject.email, JSON.stringify(existingUserObject));

    const { password: _, ...userWithoutPassword } = existingUserObject;

    return NextResponse.json(
      { message: "Profile fetched successfully", user: userWithoutPassword },
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

export async function POST(req: Request) {
  const updateAbleField = [
    "name",
    "email",
    "mobileNo",
    "profilePicUrl",
    "about",
    "skills",
    "certifications",
    "experiences",
    "educations",
  ];

  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session) {
      throw new HttpError("Session Not Found", 401);
    }

    const reqBody = await req.json();

    const user = await UserModel.findOne({ _id: session.user.id });

    if (!user) {
      throw new HttpError("User not found", 404);
    }

    await redis.del(user.email);

    let oldProfilePicUrl: string = "";

    for (const key in reqBody) {
      if (updateAbleField.includes(key) && reqBody[key]) {
        if (key === "profilePicUrl") {
          oldProfilePicUrl = (user as any)[key];
        }
        if (key === "mobileNo") {
          (user as any)[key] = "+" + reqBody[key];
        } else {
          (user as any)[key] = reqBody[key];
        }
      }
    }

    await user.save();

    const userObject = user.toObject();

    await redis.set(user.email, JSON.stringify(userObject));

    if (oldProfilePicUrl && oldProfilePicUrl !== "/assets/user.png") {
      try {
        const publicId = extractPublicId(oldProfilePicUrl);
        await cloudinary.uploader.destroy(publicId);
      } catch (error: any) {
        console.error(error);
      }
    }

    return NextResponse.json(
      { message: "User updated successfully", user: userObject },
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
