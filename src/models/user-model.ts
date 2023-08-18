import { Document, Schema, model, models } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from "bcryptjs";

import mongooseConnect from "@/lib/database";
mongooseConnect();

export interface UserDocument extends Document {
  name: string;
  email: string;
  mobileNo: string;
  password: string;
  profilePicUrl: string;
  about: string;
  skills: string[];
  certifications: {
    [key: string]: string;
  };
  experiences: [
    {
      duration: string;
      employmentType: string;
      organizationName: string;
      jobRole: string;
    }
  ];
  educations: [
    {
      instituteName: string;
      duration: string;
      courseType: string;
      moreInfo: string;
    }
  ];
  connections: UserDocument[];
  matchPassword: (plainPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      unique: true,
      validate: {
        validator(value: string) {
          const mobileRegex = /^\+(?:[0-9]?){6,14}[0-9]$/;
          return mobileRegex.test(value);
        },
        message: "Invalid mobile number format",
      },
      required: true,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator(value: string) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(value);
        },
        message: "Invalid email format",
      },
      required: true,
    },
    password: { type: String, required: true },
    profilePicUrl: {
      type: String,
      default: "/assets/user.png",
    },
    about: {
      type: String,
      default: undefined,
    },
    skills: {
      type: [String],
      default: undefined,
    },
    certifications: {
      type: Object,
      of: String,
      default: undefined,
    },
    experiences: {
      type: [
        {
          duration: {
            type: String,
            required: true,
          },
          employmentType: {
            type: String,
            required: true,
          },
          organizationName: {
            type: String,
            required: true,
          },
          jobRole: {
            type: String,
            required: true,
          },
        },
      ],
      default: undefined,
    },
    educations: {
      type: [
        {
          instituteName: {
            type: String,
            required: true,
          },
          duration: {
            type: String,
            required: true,
          },
          courseType: {
            type: String,
            required: true,
          },
          moreInfo: {
            type: String,
            required: true,
          },
        },
      ],
      default: undefined,
    },
    connections: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          default: undefined,
        },
      ],
      default: undefined,
    },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.pre<UserDocument>("save", async function save(next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function (
  plainPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password);
};

const UserModel = models.User || model<UserDocument>("User", userSchema);

export default UserModel;
