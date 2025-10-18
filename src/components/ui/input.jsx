import React from "react";

// Named export
export const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    />
  );
};
