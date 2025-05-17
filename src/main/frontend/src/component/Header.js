// src/component/Header.js
import React from "react";
import { useNavigate } from "react-router-dom";
import defaultProfileImg from "../assets/images/Generic avatar.png";
import "../component/Header.css";

const Header = ({ profileImgUrl = defaultProfileImg, onLogout }) => {
    const navigate = useNavigate();

    return (
        <header className="header-bar">
            <div className="header-right">
                <button className="profile-button" onClick={() => navigate("/myPage")}>
                    <img src={defaultProfileImg} alt="프로필" className="profile-image" />
                </button>
                <button className="logout-button" onClick={onLogout}>
                    로그아웃
                </button>
            </div>
        </header>
    );
};

export default Header;
