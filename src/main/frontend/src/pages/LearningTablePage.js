import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LearningTablePage.css";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Logo from "../component/Logo";
import defaultProfileImg from "../assets/images/Generic avatar.png";

const LearningTablePage = () => {
    const [words, setWords] = useState([]);
    const [profileImgUrl, setProfileImgUrl] = useState(defaultProfileImg);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const getUserKey = (username) => `completedDates_${username}`;

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

    useEffect(() => {
        axios.get("/api/learn/today", { withCredentials: true })
            .then(res => {
                if (Array.isArray(res.data)) {
                    setWords(res.data);
                } else {
                    setWords(res.data.words || []);
                    setProfileImgUrl(res.data.profileImgUrl || defaultProfileImg);
                }
            })
            .catch(err => {
                console.error("데이터 불러오기 실패", err);
                alert("서버 오류입니다.");
                setProfileImgUrl(defaultProfileImg);
            });
    }, []);

    const goNext = () => {
        alert("테스트를 완료하여 스탬프를 받아보세요!");
        navigate("/select-learning-type");
    };

    return (
        <div className="table-page-container">
            <div className="header-container">
                <Header profileImgUrl={profileImgUrl} onLogout={handleLogout} />
            </div>

            <div className="logo-container">
                <Logo />
            </div>

            <div className="table-content">
                <h2 className="table-title">오늘의 학습 단어</h2>

                <table className="word-table">
                    <thead>
                    <tr>
                        <th>영어 단어</th>
                        <th>단어의 뜻</th>
                    </tr>
                    </thead>
                    <tbody>
                    {words.length === 0 ? (
                        <tr>
                            <td colSpan="2">단어를 불러오는 중입니다...</td>
                        </tr>
                    ) : (
                        words.map((word, idx) => (
                            <tr key={idx}>
                                <td>{word.spelling}</td>
                                <td>{word.meaning}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <button className="back-btn" onClick={goNext}>
                    학습 완료하기
                </button>
            </div>
        </div>
    );
};

export default LearningTablePage;
