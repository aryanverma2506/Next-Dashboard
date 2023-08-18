import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut as authLogout } from "next-auth/react";

import { UserContext } from "./UserContext";
import { useHttpClient } from "../../hooks/useHttpClient-hook";
import { Experience } from "@/interfaces/Experience";
import { Education } from "@/interfaces/Education";

interface UserProviderProps extends React.PropsWithChildren {}

const UserProvider: React.FC<UserProviderProps> = (props) => {
  const { data: session } = useSession() as any;

  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");

  const [about, setAbout] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Record<string, string>>(
    {}
  );
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [connections, setConnections] = useState<string[]>([]);

  const { sendRequest } = useHttpClient();

  const logout = useCallback(async () => {
    await authLogout({
      redirect: true,
      callbackUrl: "/auth/login",
    });
    setId(() => "");
    setName(() => "");
    setEmail(() => "");
    setMobileNo(() => "");
    setProfilePicUrl(() => "");
    setAbout(() => "");
    setSkills(() => []);
    setCertifications(() => ({}));
    setExperiences(() => []);
    setEducations(() => []);
    setConnections(() => []);
  }, []);

  const login = useCallback(
    ({
      id,
      name,
      email,
      mobileNo,
      profilePicUrl,
      about,
      skills,
      certifications,
      experiences,
      educations,
      connections,
    }: {
      id?: string;
      name?: string;
      email?: string;
      mobileNo?: string;
      profilePicUrl?: string;
      about?: string;
      skills?: string[];
      certifications?: Record<string, string>;
      experiences?: Experience[];
      educations?: Education[];
      connections?: string[];
    }) => {
      id && setId(() => id);
      name && setName(() => name);
      email && setEmail(() => email);
      mobileNo && setMobileNo(() => mobileNo);
      profilePicUrl && setProfilePicUrl(() => profilePicUrl);
      about && setAbout(() => about);
      skills && setSkills(() => skills);
      certifications && setCertifications(() => certifications);
      experiences && setExperiences(() => experiences);
      educations && setEducations(() => educations);
      connections && setConnections(() => connections);
    },
    []
  );

  useEffect(() => {
    async function getUserInfo() {
      if (session?.user) {
        const responseData = await sendRequest({ url: "/api/user" });
        login(responseData.user);
      }
    }
    getUserInfo();
  }, [session?.user]);

  return (
    <UserContext.Provider
      value={{
        id,
        name,
        email,
        mobileNo,
        profilePicUrl,
        about,
        skills,
        certifications,
        experiences,
        educations,
        connections,
        login,
        logout,
        setConnections,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
