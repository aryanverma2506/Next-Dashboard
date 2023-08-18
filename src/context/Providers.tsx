"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

import UserProvider from "./User/UserProvider";

const Providers: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <SessionProvider>
      <UserProvider>{props.children}</UserProvider>
    </SessionProvider>
  );
};

export default Providers;
