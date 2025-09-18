// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
// import Registration from "../pages/Registration";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
// import ProtectedRoute from "./ProtectedRoute"; // if using auth guard

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Registration />} /> */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />


            <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
    );
};

export default AppRoutes;