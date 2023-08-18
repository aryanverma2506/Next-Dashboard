import { NextRequest, NextResponse } from "next/server";
import { extractPublicId } from "cloudinary-build-url";

import { isObjectWithLength } from "@/utils/is-object";
import UserModel from "@/models/user-model";
import HttpError from "@/models/http-error";
import redis from "@/lib/redis";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const {
    name,
    mobileNo,
    profilePicUrl,
    email,
    password,
    about,
    skills,
    certifications,
    experiences,
    educations,
  } = await req.json();

  try {
    const existingUser = await UserModel.findOne({
      $or: [
        { email: { $regex: email, $options: "i" } },
        {
          mobileNo: {
            $regex: mobileNo,
            $options: "i",
          },
        },
      ],
    });

    if (existingUser) {
      throw new HttpError("User already exist", 422);
    }

    const newUser = new UserModel({
      name: name,
      email: email,
      mobileNo: mobileNo ? "+" + mobileNo : undefined,
      password: password,
      profilePicUrl: profilePicUrl || undefined,
      about: about || undefined,
      skills: Array.isArray(skills) && skills.length > 0 ? skills : undefined,
      certifications: isObjectWithLength(certifications)
        ? certifications
        : undefined,
      experiences:
        Array.isArray(experiences) && experiences.length > 0
          ? experiences
          : undefined,
      educations:
        Array.isArray(educations) && educations.length > 0
          ? educations
          : undefined,
    });
    await newUser.save();

    const newUserObject = newUser.toObject();

    await redis.set(email, JSON.stringify(newUserObject));

    return NextResponse.json(
      {
        message: "Sign-up successful",
        userInfo: { id: newUserObject._id, email: email },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (profilePicUrl) {
      try {
        const publicId = extractPublicId(profilePicUrl);
        await cloudinary.uploader.destroy(publicId);
      } catch (error: any) {
        console.error(error);
      }
    }
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
