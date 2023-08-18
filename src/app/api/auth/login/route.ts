import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import redis from "@/lib/redis";
import UserModel from "@/models/user-model";
import HttpError from "@/models/http-error";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const cachedUserData = await redis.get(email);

    if (cachedUserData) {
      const user = JSON.parse(cachedUserData);
      if (await bcrypt.compare(password, user.password)) {
        return NextResponse.json(
          {
            message: "Login successful",
            userInfo: { id: user._id, email: email },
          },
          { status: 200 }
        );
      }
    }

    const existingUser = await UserModel.findOne({ email: email }).select({
      updatedAt: 0,
      createdAt: 0,
      __v: 0,
    });

    if (!existingUser || !(await existingUser.matchPassword(password))) {
      throw new HttpError("Invalid credentials, could not log you in.", 403);
    }

    const existingUserObject = existingUser.toObject();

    await redis.set(email, JSON.stringify(existingUserObject));

    return NextResponse.json(
      {
        message: "Login successful",
        userInfo: { id: existingUserObject._id, email: email },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
