// src/pages/MainPage.js
import axios from "axios";
import Header from "../component/Header";
import Logo from "../component/Logo";
import SearchBar from "../component/SearchBar";
import CalendarBlock from "../component/CalendarBlock";
import LearnButton from "../component/LearnButton";
import "../pages/MainPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import defaultProfileImg from "../assets/images/Generic avatar.png";
import React, { useState, useEffect } from "react";

const MainPage = () => {
    const [hello, setHello] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [profileImgUrl, setProfileImgUrl] = useState(defaultProfileImg);
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ localStorage에서 currentUser 불러오기
    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("사용자 정보 파싱 실패", e);
                localStorage.removeItem("currentUser");
                navigate("/login");
            }
        } else {
            console.warn("로그인 정보 없음. 로그인 페이지로 이동");
            navigate("/login");
        }
    }, [navigate]);

    // ✅ 인증 확인
    useEffect(() => {
        axios
            .get("/api/main", { withCredentials: true })
            .then((res) => setHello(res.data))
            .catch(() => {
                alert("인증 필요 또는 오류 발생");
                navigate("/login");
            });
    }, [navigate]);

    // ✅ 프로필 이미지 가져오기
    useEffect(() => {
        if (!currentUser||currentUser.profileImgUrl) return;
        axios.get("/api/myPage", { withCredentials: true })
            .then((res) => {
                const imgUrl = res.data.profileImgUrl || defaultProfileImg;
                setProfileImgUrl(imgUrl);

                const updatedUser = { ...currentUser, profileImgUrl: imgUrl };
                setCurrentUser(updatedUser);
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            })
            .catch(() => {
                setProfileImgUrl(defaultProfileImg);
                console.warn("프로필 이미지 불러오기 실패");
            });
    }, [currentUser]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("reload") === "1") {
            setReloadTrigger((prev) => prev + 1);
            // 쿼리 초기화 (뒤로가기 등 영향 줄이기 위해)
            navigate("/main", { replace: true });
        }
    }, [location.search, navigate]);

    const handleLogout = () => {
        axios.post("/logout", {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem("currentUser");
                navigate("/login");
            })
            .catch(() => alert("로그아웃 실패"));
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultProfileImg;
        setProfileImgUrl(defaultProfileImg);
    };

    if (!currentUser) return null; // ✅ 사용자 정보 없으면 아무것도 렌더링하지 않음

    return (
        <div className="main-container">
            <Header
                profileImgUrl={profileImgUrl}
                onLogout={handleLogout}
                onImageError={handleImageError}
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
                    key={currentUser.username}
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