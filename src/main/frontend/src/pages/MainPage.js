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

const MainPage = () => {
    const [hello, setHello] = useState("");
    const [profileImgUrl, setProfileImgUrl] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("/api/main", { withCredentials: true })
            .then((res) => setHello(res.data))
            .catch(() => {
                alert("인증 필요 또는 오류 발생");
                window.location.href = "/login";
            });
    }, []);

    const handleLogout = () => {
        axios
            .post("/logout")
            .then(() => (window.location.href = "/login"))
            .catch(() => alert("로그아웃 실패"));
    };

    return (
        <div className="main-container">
            <Header profileImgUrl={profileImgUrl} onLogout={handleLogout} />
            <Logo />
            <main className="main-content">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onMyVocaClick={() => navigate("/my-voca/card")} // 원하는 경로로 이동
                />
                <CalendarBlock selectedDate={selectedDate} onDateChange={setSelectedDate} />
                <LearnButton onClick={() => navigate("/select-learning-type")} />
            </main>
        </div>
    );
};

export default MainPage;
