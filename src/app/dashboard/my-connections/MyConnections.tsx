"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Typography } from "@mui/material";
import Image from "next/image";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { UserContext, UserContextType } from "@/context/User/UserContext";
import { useHttpClient } from "@/hooks/useHttpClient-hook";

const MyConnections: React.FC = () => {
  const { isLoading, sendRequest } = useHttpClient();
  const { connections, setConnections } =
    useContext<UserContextType>(UserContext);

  const [allConnections, setAllConnections] = useState<
    { _id: string; name: string; profilePicUrl: string }[]
  >([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const responseData = await sendRequest({ url: "/api/user/users" });
        setAllConnections(() => responseData.users);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, [sendRequest]);

  async function addRemoveConnection(option: {
    userId: string;
    type: "ADD" | "REMOVE";
  }) {
    try {
      const responseData = await sendRequest({
        url: "/api/user/connection",
        method: option.type === "ADD" ? "PUT" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: option.userId,
        }),
      });

      setConnections((prevConnections) => {
        if (option.type === "ADD") {
          return [...prevConnections, responseData.userId];
        }
        return prevConnections.filter(
          (connection) => connection !== responseData.userId
        );
      });
    } catch (error) {
      console.error(error);
    }
  }

  const yourConnections: {
    _id: string;
    name: string;
    profilePicUrl: string;
  }[] = [];

  return (
    <div className="p-1 pt-24 md:pl-60 min-h-screen max-h-screen min-w-[300px] overflow-y-auto">
      <Card className="p-5 mb-5 bg-violet-950">
        <Typography variant="h4" className="uppercase text-white">
          My Connections
        </Typography>
      </Card>
      {isLoading ? (
        <LoadingSpinner className="min-h-[500px]" />
      ) : (
        <div className="flex flex-col flex-col-reverse">
          <div>
            <Typography variant="h6">People you can also connect</Typography>
            <div className="flex flex-wrap gap-5 mt-5 justify-center">
              {allConnections.map((connection) => {
                if (connections.includes(connection._id)) {
                  yourConnections.push(connection);
                  return (
                    <React.Fragment
                      key={new Date().toISOString() + Math.random()}
                    />
                  );
                }
                return (
                  <Card
                    key={connection._id}
                    className="flex gap-5 p-5 h-full overflow-y-auto"
                  >
                    <Typography className="grid">
                      <strong className="mb-5">{connection.name}</strong>
                      <span>Full Stack Developer</span>
                      <span>@ Oruphones</span>
                      <Button
                        className="bg-violet-200 text-black text-xs rounded-full normal-case h-7 px-7 mt-5"
                        onClick={() =>
                          addRemoveConnection({
                            userId: connection._id,
                            type: "ADD",
                          })
                        }
                      >
                        Connect
                      </Button>
                    </Typography>
                    <div className="min-w-max h-28 rounded-full">
                      {connection.profilePicUrl && (
                        <Image
                          width={100}
                          height={100}
                          priority
                          alt={connection.name}
                          src={connection.profilePicUrl}
                          className="w-full h-full rounded-full bg-white"
                        />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          <div
            className={`flex flex-wrap gap-5 justify-center ${
              yourConnections.length > 0 ? "mb-20" : ""
            }`}
          >
            {yourConnections.map((connection) => (
              <Card
                key={connection._id}
                className="flex gap-5 p-5 h-full overflow-y-auto"
              >
                <Typography className="grid">
                  <strong className="mb-5">{connection.name}</strong>
                  <span>Full Stack Developer</span>
                  <span>@ Oruphones</span>
                  <Button
                    className="bg-violet-200 text-black text-xs rounded-full normal-case h-7 px-7 mt-5"
                    onClick={() =>
                      addRemoveConnection({
                        userId: connection._id,
                        type: "REMOVE",
                      })
                    }
                  >
                    Remove Connection
                  </Button>
                </Typography>
                <div className="min-w-max h-28 rounded-full">
                  {connection.profilePicUrl && (
                    <Image
                      width={100}
                      height={100}
                      priority
                      alt={connection.name}
                      src={connection.profilePicUrl}
                      className="w-full h-full rounded-full bg-white"
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyConnections;
