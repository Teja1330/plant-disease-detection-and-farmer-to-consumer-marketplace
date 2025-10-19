import React from "react";
import { cn } from "@/lib/utils"; // optional, for merging classNames

export const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={cn(
        "border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary",
        className
      )}
    />
  );
};
