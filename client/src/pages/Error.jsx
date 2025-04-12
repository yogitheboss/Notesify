import React from "react";
import { Link } from "react-router";
const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Error</h1>
      <p className="text-2xl">Page not found</p>
      <Link to="/">Go to home</Link>
    </div>
  );
};

export default Error;
