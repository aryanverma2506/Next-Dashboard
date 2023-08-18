import React, { useContext, useState } from "react";
import { Button, Card } from "@mui/material";

import NavLink from "../../common/NavLink/NavLink";
import { UserContext, UserContextType } from "@/context/User/UserContext";

interface SideMenuProps extends React.PropsWithChildren {
  readonly isMenuOpen?: boolean;
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideMenu: React.FC<SideMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { logout: logoutCtx } = useContext<UserContextType>(UserContext);

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed md:hidden left-0 right-0 top-0 bottom-0 bg-black/30"
          onClick={setIsMenuOpen?.bind(null, false)}
        ></div>
      )}
      <Card
        className={`fixed flex flex-col justify-between h-screen ${
          isMenuOpen ? "left-0" : "-left-60"
        } md:left-0 top-0 p-5 min-w-max`}
        style={{ borderRadius: 0 }}
      >
        <ul className="flex flex-col gap-5">
          <Button
            variant="outlined"
            color="inherit"
            className="normal-case px-6 ml-7 text-md"
            onClick={setIsMenuOpen?.bind(null, false)}
          >
            Dashboard
          </Button>
          <li className="text-blue-500">
            <i className="fa-solid fa-chevron-right fa-sm" />
            <NavLink
              href={"/dashboard/my-profile"}
              activeClassName="border border-blue-500"
              className="normal-case px-6 py-2 ml-4 text-md rounded-md"
              onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
            >
              My Profile
            </NavLink>
          </li>
          <li className="text-blue-500">
            <i className="fa-solid fa-chevron-right fa-sm" />
            <NavLink
              href={"/dashboard/my-connections"}
              activeClassName="border border-blue-500"
              className="normal-case px-6 py-2 ml-4 text-md rounded-md"
              onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
            >
              My Connections
            </NavLink>
          </li>
        </ul>
        <Button
          variant="outlined"
          color="error"
          className="w-full normal-case"
          onClick={() => {
            logoutCtx();
            setIsMenuOpen && setIsMenuOpen(false);
          }}
        >
          Log out
        </Button>
      </Card>
    </>
  );
};

export default SideMenu;
