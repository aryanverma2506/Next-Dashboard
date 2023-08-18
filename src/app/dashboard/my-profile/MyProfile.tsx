"use client";
import React, { useContext, useEffect, useRef, useState } from "react";

import Image from "next/image";
import { Card, TextField, Typography } from "@mui/material";

import Input from "@/components/common/Input/Input";
import SelectSkills from "@/components/common/SelectSkills/SelectSkills";
import CertificationInput from "@/components/common/CertificationInput/CertificationInput";
import ExperienceInput from "@/components/common/ExperienceInput/ExperienceInput";
import EducationInput from "@/components/common/EducationInput/EducationInput";
import PhoneInput from "@/components/common/PhoneInput/PhoneInput";
import EditButton from "@/components/common/EditButton/EditButton";
import OverlayModal from "@/components/common/OverlayModal/OverlayModal";
import { UserContext, UserContextType } from "@/context/User/UserContext";
import { useHttpClient } from "@/hooks/useHttpClient-hook";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { Experience } from "@/interfaces/Experience";
import { Education } from "@/interfaces/Education";
import { uploadToCloudinary } from "@/app/actions";

type EditType =
  | ""
  | "name"
  | "email"
  | "mobileNo"
  | "profilePic"
  | "about"
  | "skills"
  | "certifications"
  | "experiences"
  | "educations";

const InfoCard: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Card
    className="flex flex-col gap-4 p-5"
    sx={{
      p: 2,
      m: 1,
      boxShadow: 3,
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
      fontSize: "0.875rem",
      fontWeight: "700",
    }}
  >
    {children}
  </Card>
);

const MyProfile: React.FC = () => {
  const {
    name: nameCtx,
    email: emailCtx,
    mobileNo: mobileNoCtx,
    profilePicUrl: profilePicUrlCtx,
    about: aboutCtx,
    skills: skillsCtx,
    certifications: certificationsCtx,
    experiences: experiencesCtx,
    educations: educationsCtx,
    login: loginCtx,
  } = useContext<UserContextType>(UserContext);

  const previewAvatarRef = useRef<HTMLImageElement>(null);
  const { sendRequest } = useHttpClient();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editFieldType, setEditFieldType] = useState<EditType>("");
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [mobileNo, setMobileNo] = useState<string>();
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const [about, setAbout] = useState<string>();
  const [skills, setSkills] = useState<string[]>();
  const [certifications, setCertifications] =
    useState<Record<string, string>>();
  const [experiences, setExperiences] = useState<Experience[]>();
  const [educations, setEducations] = useState<Education[]>();

  useEffect(() => {
    if (isModalOpen) {
      setName(() => undefined);
      setEmail(() => undefined);
      setMobileNo(() => undefined);
      setProfilePic(() => null);
      setAbout(() => undefined);
      setSkills(() => undefined);
      setCertifications(() => undefined);
      setExperiences(() => undefined);
      setEducations(() => undefined);
    }
  }, [isModalOpen]);

  async function profileUpdateHandler(event: React.FormEvent) {
    event.preventDefault();
    let profilePicUrl = "";
    const body: Record<string, string | {} | []> = {};
    switch (editFieldType) {
      case "name":
        name && (body.name = name);
        break;
      case "email":
        email && (body.email = email);
        break;
      case "mobileNo":
        mobileNo && (body.mobileNo = mobileNo);
        break;
      case "profilePic":
        const formData = new FormData();
        profilePic && formData.append("file", profilePic);
        profilePic && (body.profilePicUrl = await uploadToCloudinary(formData));
        break;
      case "about":
        about && (body.about = about);
        break;
      case "skills":
        skills && (body.skills = skills);
        break;
      case "certifications":
        certifications && (body.certifications = certifications);
        break;
      case "experiences":
        experiences && (body.experiences = experiences);
        break;
      case "educations":
        educations && (body.educations = educations);
        break;
      default:
        return;
    }

    try {
      const responseData = await sendRequest({
        url: "/api/user",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      loginCtx(responseData.user);
    } catch (error: any) {
      console.error(error);
    }

    setIsModalOpen(() => false);
  }

  function modalPreviewHandler(editType: EditType) {
    setIsModalOpen(() => true);
    setEditFieldType(() => editType);
  }

  return (
    <div className="relative p-1 pt-24 md:pl-60 min-h-screen max-h-screen min-w-[300px]">
      <OverlayModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen((prevState) => !prevState)}
        submitHandler={profileUpdateHandler}
      >
        {(() => {
          switch (editFieldType) {
            case "name":
              !name && setName(() => nameCtx);
              return (
                <TextField
                  type="name"
                  required
                  label="Your Name"
                  value={name}
                  onChange={(e) => e && setName(() => e.target.value)}
                />
              );
            case "email":
              !email && setEmail(() => emailCtx);
              return (
                email && (
                  <TextField
                    type="email"
                    required
                    label="E-Mail"
                    value={email}
                    onChange={(e) => e && setEmail(() => e.target.value)}
                  />
                )
              );
            case "mobileNo":
              !mobileNo && setMobileNo(() => mobileNoCtx);
              return (
                mobileNo && (
                  <div>
                    <PhoneInput value={mobileNo} onChange={setMobileNo} />
                  </div>
                )
              );
            case "profilePic":
              return (
                <div className="relative mx-auto w-40 h-40 rounded-full border-4 border-blue-500">
                  {(profilePic || profilePicUrlCtx) && (
                    <Image
                      ref={previewAvatarRef}
                      priority
                      width={100}
                      height={100}
                      alt={profilePic ? profilePic.name : "User profile"}
                      src={
                        profilePic
                          ? URL.createObjectURL(profilePic)
                          : profilePicUrlCtx
                      }
                      className="w-full h-full rounded-full bg-white"
                    />
                  )}
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
              );
            case "about":
              !about && setAbout(() => aboutCtx);
              return (
                about && (
                  <TextField
                    multiline
                    rows={4}
                    label="About"
                    value={about}
                    onChange={(e) => e && setAbout(() => e.target.value)}
                  />
                )
              );
            case "skills":
              !skills && setSkills(() => skillsCtx);
              return (
                skills && (
                  <SelectSkills
                    skills={skills}
                    setSkills={setSkills}
                    skillOptions={["React", "Typescript"]}
                  />
                )
              );
            case "certifications":
              !certifications && setCertifications(() => certificationsCtx);
              return (
                certifications && (
                  <CertificationInput
                    certifications={certifications}
                    setCertifications={setCertifications}
                  />
                )
              );
            case "experiences":
              !experiences && setExperiences(() => experiencesCtx);
              return (
                experiences && (
                  <ExperienceInput
                    experiences={experiences}
                    setExperiences={setExperiences}
                  />
                )
              );
            case "educations":
              !educations && setEducations(() => educationsCtx);
              return (
                educations && (
                  <EducationInput
                    educations={educations}
                    setEducations={setEducations}
                  />
                )
              );
            default:
              return <></>; // Render nothing if editFieldType doesn't match any case
          }
        })()}
      </OverlayModal>
      <Card className="h-48 p-5 bg-violet-950">
        <Typography variant="h4" className="uppercase text-white">
          My Profile
        </Typography>
      </Card>
      <div className="absolute p-4 md:px-10 left-0 md:left-60 right-0 top-40 bottom-2 ">
        <Card className="p-4 md:p-10 h-full overflow-y-auto w-full">
          <div className="lg:flex gap-12">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between mx-2">
                {profilePicUrlCtx && (
                  <Image
                    width={100}
                    height={100}
                    priority
                    alt={nameCtx}
                    src={profilePicUrlCtx}
                    className="h-20 w-20 md:h-28 md:w-28 rounded-full bg-white"
                  />
                )}
                <EditButton onClick={() => modalPreviewHandler("profilePic")}>
                  Upload Photo
                </EditButton>
              </div>
              <InfoCard>
                <Typography className="block max-w-full hyphens-auto text-sm">
                  Your Name
                  <span className="flex items-center justify-between">
                    <strong>{nameCtx}</strong>
                    <EditButton onClick={() => modalPreviewHandler("name")}>
                      Edit
                    </EditButton>
                  </span>
                </Typography>
                <Typography className="block max-w-full hyphens-auto text-sm">
                  Email
                  <span className="flex items-center justify-between">
                    <strong>{emailCtx}</strong>
                    <EditButton onClick={() => modalPreviewHandler("email")}>
                      Edit
                    </EditButton>
                  </span>
                </Typography>
                <Typography className="block max-w-full hyphens-auto text-sm">
                  Phone Number
                  <span className="flex items-center justify-between">
                    <strong>{mobileNoCtx}</strong>
                    <EditButton onClick={() => modalPreviewHandler("mobileNo")}>
                      Edit
                    </EditButton>
                  </span>
                </Typography>
              </InfoCard>
              <InfoCard>
                <Typography
                  variant="h5"
                  className="flex items-center justify-between max-w-full"
                >
                  <strong>{"About " + nameCtx}</strong>
                  <EditButton onClick={() => modalPreviewHandler("about")}>
                    Edit
                  </EditButton>
                </Typography>
                <span className="text-xs">{aboutCtx}</span>
              </InfoCard>
              <InfoCard>
                <Typography
                  variant="h5"
                  className="flex items-center justify-between max-w-full"
                >
                  <strong>Skills</strong>
                  <EditButton onClick={() => modalPreviewHandler("skills")}>
                    Edit
                  </EditButton>
                </Typography>
                <ul className="flex flex-col gap-4">
                  {skillsCtx.map((skillCtx) => (
                    <li key={new Date().toISOString() + Math.random()}>
                      {skillCtx}
                    </li>
                  ))}
                </ul>
              </InfoCard>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <InfoCard>
                <div className="flex items-center gap-10">
                  <Typography
                    variant="h6"
                    className="flex gap-4 items-center max-w-full text-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <strong>Professional Details</strong>
                      <span className="block hyphens-auto">
                        This are the professional details shown to users in the
                        app
                      </span>
                    </div>
                  </Typography>
                  <div className="min-w-max h-14">
                    <Image
                      width={100}
                      height={100}
                      priority
                      alt="User profile"
                      src={`/assets/star-couple.png`}
                      className="w-full h-full rounded-md bg-white"
                    />
                  </div>
                </div>
              </InfoCard>
              <div className="grid gap-5">
                <Typography
                  variant="h6"
                  className="flex justify-between items-center max-w-full text-sm"
                >
                  <strong>Certifications</strong>
                  <EditButton
                    onClick={() => modalPreviewHandler("certifications")}
                  >
                    Edit
                  </EditButton>
                </Typography>
                {Object.keys(certificationsCtx).map((certificate) => (
                  <Card
                    key={certificate}
                    className="flex items-center w-full rounded-full px-7 py-1 border"
                  >
                    <div className="min-w-max h-14">
                      <Image
                        width={100}
                        height={100}
                        priority
                        alt="User profile"
                        src={`/assets/badge.png`}
                        className="w-full h-full rounded-md bg-white"
                      />
                    </div>
                    <Typography className="flex flex-col items-center w-full text-md">
                      <strong>{certificate}</strong>
                      <span>{certificationsCtx[certificate]}</span>
                    </Typography>
                  </Card>
                ))}
                <Typography
                  variant="h6"
                  className="flex justify-between items-center max-w-full text-sm"
                >
                  <strong>Experience</strong>
                  <EditButton
                    onClick={() => modalPreviewHandler("experiences")}
                  >
                    Edit
                  </EditButton>
                </Typography>
                {experiencesCtx.map((experience) => (
                  <InfoCard key={new Date().toISOString() + Math.random()}>
                    <div className="flex justify-between">
                      <div className="grid grid-cols-2 gap-5 w-1/2 text-sm">
                        <strong>{experience.duration}</strong>
                        <strong>{experience.employmentType}</strong>
                        <span>{experience.organizationName}</span>
                        <span>-- {experience.jobRole}</span>
                      </div>
                      <Image
                        width={80}
                        height={80}
                        priority
                        alt="logo"
                        src={`/assets/logo.svg`}
                        style={{ width: "auto !important" }}
                      />
                    </div>
                  </InfoCard>
                ))}
                <Typography
                  variant="h6"
                  className="flex justify-between items-center max-w-full text-sm"
                >
                  <strong>Education</strong>
                  <EditButton onClick={() => modalPreviewHandler("educations")}>
                    Edit
                  </EditButton>
                </Typography>
                {educationsCtx.map((education) => (
                  <InfoCard key={new Date().toISOString() + Math.random()}>
                    <Typography
                      variant="h5"
                      className="uppercase text-violet-500"
                    >
                      <strong>{education.instituteName}</strong>
                    </Typography>
                    <div className="flex justify-between">
                      <span>{education.duration}</span>
                      <span>{education.courseType}</span>
                    </div>
                    <span>{education.moreInfo}</span>
                  </InfoCard>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MyProfile;
