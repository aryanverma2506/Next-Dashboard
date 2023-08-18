import React from "react";
import { redirect } from "next/navigation";

const Auth: React.FC = () => {
  redirect("/auth/login");
};

export default Auth;
