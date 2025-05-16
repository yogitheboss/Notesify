// App.jsx
import React from "react";
import { Routes, Route } from "react-router";
import Main from "./pages/Main";
import "./App.css";
// Import other pages as needed
import SigninPage from "./pages/Signin";
import SignUpPage from "./pages/SignUp";
import ErrorPage from "./pages/Error";
import { Navigate } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
const App = () => {
  return (
    <div className="app ">
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Main />} />
        </Route>
        <Route path="/login" element={<Navigate to="/signin" />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SigninPage />} />
        {/* default route */}
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
