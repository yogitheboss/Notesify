import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signup = useUserStore((state) => state.signup);
  const navigate = useNavigate();
  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      await signup(email, password, name);
      console.log("Successfully signed up with:", { email });
      navigate("/signin");

      // You can redirect or show a success message here
    } catch (error) {
      console.error("Failed to sign up:", error);
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
        <form onSubmit={handleSignup}>
          <div className="mb-5 flex items-center gap-3 rounded-full bg-[#333A5c] px-6 py-3">
            <FaUser className="text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-5 flex items-center gap-3 rounded-full bg-[#333A5c] px-6 py-3">
            <FaEnvelope className="text-gray-400" />
            <input
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
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 py-3 font-medium tracking-wide text-white cursor-pointer hover:opacity-90">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
