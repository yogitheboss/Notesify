import React, { useState } from "react";
import "./Signin.css"; // Assuming you have a CSS file for styling
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router";
import { useUserStore } from "../../store/user"; // Import the user store
import { useNavigate } from "react-router";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useUserStore((state) => state.login); // Get the login function from the store
  const navigate = useNavigate();
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Call the login function
      console.log("Successfully signed in with:", { email });
      // You can redirect or show a success message here
      navigate("/");
    } catch (error) {
      console.error("Failed to sign in:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400 relative pb-32">
      <div className="w-full max-w-md rounded-lg bg-slate-900 p-10 text-indigo-300 shadow-xl">
        <h1 className="mb-4 text-center text-3xl font-semibold text-white">
          Create Account
        </h1>
        <p className="mb-6 text-center text-md">Create your account now!</p>
        <form onSubmit={handleSignIn}>
          <div className="mb-5 flex items-center gap-3 rounded-full bg-[#333A5c] px-6 py-3">
            <FaEnvelope className="text-gray-400" />
            <input
              style={{
                border: "none",
              }}
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-5 flex items-center gap-3 rounded-full bg-[#333A5c] px-6 py-3">
            <FaLock className="text-gray-400" />
            <input
              style={{
                border: "none",
              }}
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 py-3 font-medium tracking-wide text-white cursor-pointer hover:opacity-90">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          New to Notesify?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
