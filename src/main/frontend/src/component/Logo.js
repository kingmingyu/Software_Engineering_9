// src/component/Logo.js
import React from "react";
import logo from "../assets/images/logo.png";
import "../component/Logo.css";

const Logo = () => (
    <div className="logo-wrapper">
        <img src={logo} alt="VOCAcino logo" className="logo-image" />
    </div>
);

export default Logo;
