import React from "react";
import avatar from "../assets/avatar.png";
import { GoHome } from "react-icons/go";
import { IoIosCreate } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
const Sidebar = ({ tab, setTab }) => {
  return (
    <div className="flex h-full bg-white shadow-lg">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col items-center mt-6">
          {/* Logo or Avatar */}
          <div className="mb-8">
            <img
              src={avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          {/* Sidebar Menu */}
          <ul className="space-y-4 w-full px-4">
            <li
              onClick={() => {
                setTab("home");
              }}
            >
              <a
                href="#home"
                className={`flex items-center space-x-2 text-gray-700  hover:text-blue-500 ${
                  tab === "home" ? "text-blue-800" : ""
                }`}
              >
                <GoHome />
                <span>Home</span>
              </a>
            </li>
            <li
              onClick={() => {
                setTab("create");
              }}
            >
              <a
                href="#create"
                className={`flex items-center space-x-2 text-gray-700  hover:text-blue-500 ${
                  tab === "create" ? "text-blue-800" : ""
                }`}
              >
                <IoIosCreate />
                <span>Create</span>
              </a>
            </li>
            <li
              onClick={() => {
                setTab("bookmark");
              }}
            >
              <a
                href="#bookmark"
                className={`flex items-center space-x-2 text-gray-700  hover:text-blue-500 ${
                  tab === "bookmark" ? "text-blue-800" : ""
                }`}
              >
                <CiBookmark />
                <span>Bookmark</span>
              </a>
            </li>
            <li
              onClick={() => {
                setTab("profile");
              }}
            >
              <a
                href="#profile"
                className={`flex items-center space-x-2 text-gray-700  hover:text-blue-500 ${
                  tab === "profile" ? "text-blue-800" : ""
                }`}
              >
                <CgProfile />
                <span>Profile</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
