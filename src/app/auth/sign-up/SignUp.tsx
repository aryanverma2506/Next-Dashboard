"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { signIn as authLogin } from "next-auth/react";
import { Button, Card } from "@mui/material";

import Input from "@/components/common/Input/Input";
import SelectSkills from "@/components/common/SelectSkills/SelectSkills";
import CertificationInput from "@/components/common/CertificationInput/CertificationInput";
import ExperienceInput from "@/components/common/ExperienceInput/ExperienceInput";
import EducationInput from "@/components/common/EducationInput/EducationInput";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PhoneInput from "@/components/common/PhoneInput/PhoneInput";
import { useHttpClient } from "@/hooks/useHttpClient-hook";

import { Experience } from "@/interfaces/Experience";
import { Education } from "@/interfaces/Education";
import { uploadToCloudinary } from "@/app/actions";

const SignUp: React.FC = () => {
  const { sendRequest } = useHttpClient();

  const previewAvatarRef = useRef<HTMLImageElement>(null);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const [about, setAbout] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Record<string, string>>(
    {}
  );
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function signUpHandler(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(() => true);
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      let profilePicUrl = "";
      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);
        profilePicUrl = await uploadToCloudinary(formData);
      }

      await sendRequest({
        url: "/api/auth/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      await authLogin("credentials", {
        email: email,
        password: password,
        redirect: true,
        callbackUrl: "/dashboard/my-profile",
      });
    } catch (error: any) {
      console.error(error.message);
    }
    setIsLoading(() => false);
  }

  useEffect(() => {
    if (previewAvatarRef.current && profilePic) {
      const avatarStyles = previewAvatarRef.current.style;
      avatarStyles.opacity = "0";
      const fadeInEffect = setInterval(() => {
        if (avatarStyles && +avatarStyles.opacity < 1) {
          avatarStyles.opacity = (+avatarStyles.opacity + 0.0015).toString();
        } else {
          clearInterval(fadeInEffect);
        }
      }, 0);

      return () => {
        clearInterval(fadeInEffect);
      };
    }
  }, [profilePic]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-full h-screen p-2">
          <form
            className="flex flex-col sm:items-center sm:justify-center mx-auto mb-2 text-black h-full text-center"
            onSubmit={signUpHandler}
          >
            <Card className="relative p-4 lg:w-full">
              <div className="flex flex-col lg:flex-row gap-4 h-[90%] overflow-y-auto">
                <div className="flex flex-col gap-4 min-w-min lg:w-1/4">
                  <Card className="flex flex-col gap-4 p-4 border-2 border-black h-full">
                    <div className="relative mx-auto w-40 h-40 rounded-full border-4 border-blue-500">
                      <Image
                        ref={previewAvatarRef}
                        className="w-full h-full rounded-full bg-white"
                        width={100}
                        height={100}
                        priority
                        src={
                          profilePic
                            ? URL.createObjectURL(profilePic)
                            : `/assets/user.png`
                        }
                        alt={profilePic ? profilePic.name : "User profile"}
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        placeholder="No file chosen"
                        className="absolute flex items-center justify-center w-8 h-8 text-sm text-[#1976d2] bg-white hover:text-white hover:bg-[#1976d2] border-2 border-[#1976d2] right-2 bottom-2 rounded-full focus:none shadow-2xl"
                        callback={setProfilePic}
                      >
                        <i className="fa-solid fa-camera"></i>
                      </Input>
                    </div>
                    <TextField
                      type="name"
                      required
                      label="Your Name"
                      value={name}
                      onChange={(e) => e && setName(() => e.target.value)}
                    />
                    <PhoneInput value={mobileNo} onChange={setMobileNo} />
                    <TextField
                      type="email"
                      required
                      label="E-Mail"
                      value={email}
                      onChange={(e) => e && setEmail(() => e.target.value)}
                    />

                    <TextField
                      type="password"
                      required
                      label="Password"
                      value={password}
                      onChange={(e) => e && setPassword(() => e.target.value)}
                    />
                    <TextField
                      type="password"
                      required
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) =>
                        e && setConfirmPassword(() => e.target.value)
                      }
                    />
                  </Card>
                </div>
                <div className="grid lg:flex flex-col gap-4 lg:w-1/4 h-auto">
                  <Card className="flex flex-col gap-4 p-4 border-2 border-black lg:h-1/2 min-h-max">
                    <TextField
                      multiline
                      rows={4}
                      label="About"
                      value={about}
                      onChange={(e) => e && setAbout(() => e.target.value)}
                    />
                    <SelectSkills
                      skills={skills}
                      setSkills={setSkills}
                      skillOptions={["React", "Typescript"]}
                    />
                  </Card>
                  <Card className="flex flex-col gap-4 py-2 px-4 border-2 border-black lg:h-1/2 min-h-max">
                    <CertificationInput
                      certifications={certifications}
                      setCertifications={setCertifications}
                    />
                  </Card>
                </div>
                <div className="flex flex-col gap-4 lg:w-1/4">
                  <Card className="flex flex-col gap-4 py-2 px-4 border-2 border-black h-full">
                    <ExperienceInput
                      experiences={experiences}
                      setExperiences={setExperiences}
                    />
                  </Card>
                </div>
                <div className="flex flex-col gap-4 lg:w-1/4">
                  <Card className="flex flex-col gap-4 py-2 px-4 border-2 border-black h-full">
                    <EducationInput
                      educations={educations}
                      setEducations={setEducations}
                    />
                  </Card>
                </div>
              </div>
              <Button
                type="submit"
                className="bg-[#1976d2] hover:bg-[#1976d2] text-white block w-full rounded-sm p-2 mt-5 lg:my-5"
              >
                Register
              </Button>
            </Card>
            <p>
              {"Already a member? "}
              <Link href="/auth/login" className="text-[#1976d2]">
                Login here
              </Link>
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignUp;
