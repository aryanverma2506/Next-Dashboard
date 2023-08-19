"use client";
import React, { useState } from "react";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { signIn as authLogin } from "next-auth/react";
import { Button, Card } from "@mui/material";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function loginHandler(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(() => true);
    try {
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

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-full h-screen p-2">
          <form
            className="flex flex-col items-center justify-center w-64 mx-auto mb-2 h-full"
            onSubmit={loginHandler}
          >
            <Card className="flex flex-col gap-5 p-4">
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
              <Button
                type="submit"
                className="bg-[#1976d2] hover:bg-[#1976d2] text-white block w-full rounded-sm p-2"
              >
                Login
              </Button>
            </Card>
            {"Don't have an account? "}
            <br />
            <Link href="/auth/sign-up" className="text-[#1976d2]">
              Register here
            </Link>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
