import { createContext } from "react";

import { Education } from "@/interfaces/Education";
import { Experience } from "@/interfaces/Experience";

export interface UserContextType {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly mobileNo: string;
  readonly profilePicUrl: string;
  readonly about: string;
  readonly skills: string[];
  readonly certifications: Record<string, string>;
  readonly experiences: Experience[];
  readonly educations: Education[];
  readonly connections: string[];
  login: (user: {
    id: string;
    name: string;
    email: string;
    mobileNo: string;
    profilePicUrl: string;
    about: string;
    skills: string[];
    certifications: {};
    experiences: Experience[];
    educations: Education[];
    connections: string[];
  }) => void;
  logout: () => void;
  setConnections: React.Dispatch<React.SetStateAction<string[]>>;
}

export const UserContext = createContext<UserContextType>({
  id: "",
  name: "",
  email: "",
  mobileNo: "",
  profilePicUrl: "",
  about: "",
  skills: [],
  certifications: {},
  experiences: [],
  educations: [],
  connections: [],
  login: (user) => {},
  logout: () => {},
  setConnections: () => {},
});
