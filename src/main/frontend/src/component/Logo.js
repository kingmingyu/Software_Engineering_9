// src/component/Logo.js
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../component/Logo.css";

const Logo = () => {
    const navigate = useNavigate();

    return (
        <div className="logo-wrapper" onClick={() => navigate("/main")}>
            <img src={logo} alt="VOCAcino logo" className="logo-image" />
        </div>
    );
};

export default Logo;
