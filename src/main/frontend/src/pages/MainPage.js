// src/pages/MainPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../component/Header";
import Logo from "../component/Logo";
import SearchBar from "../component/SearchBar";
import CalendarBlock from "../component/CalendarBlock";
import LearnButton from "../component/LearnButton";
import "../pages/MainPage.css";
import { useNavigate } from "react-router-dom";
import defaultProfileImg from "../assets/images/Generic avatar.png";

// 사용자별 localStorage 키 생성 함수
const getUserKey = (username) => `completedDates_${username}`;

const MainPage = () => {
    const [hello, setHello] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [profileImgUrl, setProfileImgUrl] = useState(defaultProfileImg);

    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        axios
            .get("/api/main", { withCredentials: true })
            .then((res) => setHello(res.data))
            .catch(() => {
                alert("인증 필요 또는 오류 발생");
                window.location.href = "/login";
            });
    }, []);

    useEffect(() => {
        axios.get("/api/myPage", { withCredentials: true })
            .then((res) => {
                const imgUrl = res.data.profileImgUrl || defaultProfileImg;
                setProfileImgUrl(imgUrl);
                if (currentUser) {
                    const updatedUser = { ...currentUser, profileImgUrl: imgUrl };
                    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
                }
            })
            .catch(() => {
                setProfileImgUrl(defaultProfileImg);
                console.warn("프로필 이미지 불러오기 실패");
            });
    }, []);

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

    // 프로필 이미지 로딩 실패 시 기본 이미지로 대체
    const handleImageError = (e) => {
        e.target.onerror = null; // 무한 루프 방지
        e.target.src = defaultProfileImg;
        setProfileImgUrl(defaultProfileImg); // 상태도 기본 이미지로 변경
    };

    return (
        <div className="main-container">
            <Header
                profileImgUrl={profileImgUrl}
                onLogout={handleLogout}
                onImageError={handleImageError} // Header로 에러 처리 함수 전달
            />

            <div className="logo-container">
                <Logo />
            </div>

            <main className="main-content">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onMyVocaClick={() => navigate("/my-voca/card")}
                />
                <CalendarBlock
                    key={reloadTrigger}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    currentUser={currentUser}
                    reloadTrigger={reloadTrigger}
                />
                <LearnButton onClick={() => navigate("/select-learning-type")} />
            </main>
        </div>
    );
};

export default MainPage;
