import React from "react";
import { Button } from "@mui/material";

interface EditButtonProps extends React.PropsWithChildren {
  onClick?: (...args: any) => void;
}

const EditButton: React.FC<EditButtonProps> = ({ children, onClick }) => (
  <Button
    className="bg-violet-200 text-black text-xs rounded-full normal-case h-7 px-7"
    onClick={onClick}
  >
    {children}
  </Button>
);

export default EditButton;
