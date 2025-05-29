// src/pages/LearningCardPageUserVoca.js
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

    // 로그아웃 처리
    const handleLogout = () => {
        axios.post("/logout")
            .then(() => {
                localStorage.removeItem("currentUser");
                navigate("/login");
            })
            .catch(() => alert("로그아웃 실패"));
    };

    // 단어 목록 가져오기
    useEffect(() => {
        axios.get("/api/user-voca", { withCredentials: true })
            .then(res => setWords(res.data))
            .catch(err => {
                console.error("단어 불러오기 실패", err);
                alert("서버 오류입니다.");
            });
    }, []);

    // 프로필 이미지 불러오기
    useEffect(() => {
        axios.get("/api/learn/today", { withCredentials: true })
            .then(res => {
                setProfileImgUrl(res.data.profileImgUrl || defaultProfileImg);
            })
            .catch(err => {
                console.error("프로필 이미지 불러오기 실패");
                setProfileImgUrl(defaultProfileImg);
            });
    }, []);

    const goNext = () => {
        navigate("/main");
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
                <h2 className="table-title">저장한 단어</h2>
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
                    메인화면으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default LearningTablePage;
