// src/pages/LearningTypeSelection.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LearningTypeSelection.css";
import Header from "../component/Header";
import Logo from "../component/Logo";
import { useNavigate } from "react-router-dom";
import defaultProfileImg from "../assets/images/Generic avatar.png";

const LearningTypeSelection = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [profileImgUrl, setProfileImgUrl] = useState(defaultProfileImg);

    useEffect(() => {
        const userData = localStorage.getItem("currentUser");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setCurrentUser(parsedUser);
            setProfileImgUrl(parsedUser.profileImgUrl || defaultProfileImg);
        } else {
            alert("로그인이 필요합니다.");
            navigate("/login");
        }
    }, [navigate]);

    const getUserKey = (username) => `completedDates_${username}`;

    useEffect(() => {
        if (!currentUser) return;

        axios.get("/api/myPage", { withCredentials: true })
            .then((res) => {
                const imgUrl = res.data.profileImgUrl || defaultProfileImg;
                setProfileImgUrl(imgUrl);

                const updatedUser = {
                    ...currentUser,
                    profileImgUrl: imgUrl,
                };
                setCurrentUser(updatedUser);
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            })
            .catch(() => {
                console.warn("프로필 이미지 불러오기 실패");
                setProfileImgUrl(defaultProfileImg);
            });
    }, [currentUser]);

    const handleLogout = () => {
        if (currentUser) {
            const userKey = getUserKey(currentUser.username);
            localStorage.removeItem(userKey); // 🔥 해당 사용자 기록만 삭제
        }

        axios.post("/logout")
            .then(() => {
                navigate("/login");
            })
            .catch(() => alert("로그아웃 실패"));
    };

    // 이미지 로딩 실패 시 기본 이미지로 대체
    const handleImageError = (e) => {
        e.target.onerror = null; // 무한 루프 방지
        e.target.src = defaultProfileImg;
        setProfileImgUrl(defaultProfileImg);
    };

    return (
        <div className="learning-selection-container">
            <Header
                profileImgUrl={profileImgUrl}
                onLogout={handleLogout}
                onImageError={handleImageError} // Header에 전달
            />
            <Logo />
            <main className="selection-main">
                <div className="selection-box">
                    <button
                        className="selection-button"
                        onClick={() => navigate("/learn/card")}
                    >
                        단어 학습하기
                    </button>
                    <button
                        className="selection-button"
                        onClick={() => navigate("/word-test")}
                    >
                        단어 테스트하기
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LearningTypeSelection;

