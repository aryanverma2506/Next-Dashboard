"use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Card } from "@mui/material";

import SideMenu from "./SideMenu/SideMenu";
import { UserContext, UserContextType } from "@/context/User/UserContext";

const Navbar: React.FC<React.PropsWithChildren> = (props) => {
  const { name, profilePicUrl } = useContext<UserContextType>(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <>
      <Card
        className="fixed z-10 flex gap-4 w-full min-w-max p-2 md:p-4 md:pr-10 justify-between"
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-center md:gap-2">
          <Button
            color="warning"
            className="flex flex-col gap-2 w-4 md:px-4 items-start"
            onClick={setIsMenuOpen.bind(null, true)}
          >
            <span className="w-2/4 md:w-4/5 border border-black" />
            <span className="w-3/4 md:w-full border border-yellow-400" />
            <span className="w-1/4 md:w-1/2 border border-black" />
          </Button>
          <div>
            <Image
              width={80}
              height={80}
              priority
              alt="Logo"
              src={`/assets/logo.svg`}
              style={{ width: "auto" }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <i className="fa-light fa-bell fa-xl"></i>
          <Link
            href="/dashboard/my-profile"
            className="no-underline text-black"
          >
            <Button
              variant="outlined"
              color="inherit"
              className="hidden sm:flex gap-2 items-center justify-between rounded-md px-3 normal-case"
            >
              {profilePicUrl && (
                <Image
                  width={100}
                  height={100}
                  priority
                  alt={"User profile"}
                  src={profilePicUrl}
                  className="w-10 h-10 rounded-md bg-white border"
                />
              )}
              <div className="text-left">
                <p className="text-xs">Welcome back,</p>
                <p className="text-lg">{name}</p>
              </div>
              <i className="fa-solid fa-chevron-down ml-8"></i>
            </Button>
            <Button className="w-10 sm:hidden">
              {profilePicUrl && (
                <Image
                  width={100}
                  height={100}
                  priority
                  alt={name}
                  src={profilePicUrl}
                  className="w-10 h-10 rounded-full bg-white border"
                />
              )}
            </Button>
          </Link>
        </div>
        <SideMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </Card>
      {props.children}
    </>
  );
};

export default Navbar;
