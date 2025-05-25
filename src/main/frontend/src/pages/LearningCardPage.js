// src/pages/LearningCardPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LearningCardPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Logo from "../component/Logo";
import defaultProfileImg from "../assets/images/Generic avatar.png";

const LearningCardPage = () => {
    const [words, setWords] = useState([]);
    const [index, setIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(true);
    const [profileImgUrl, setProfileImgUrl] = useState(defaultProfileImg);

    const navigate = useNavigate();

    // 유저 정보 키 관련 함수
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const getUserKey = (username) => `completedDates_${username}`;

    useEffect(() => {
        // 오늘의 단어 불러오기
        axios.get("/api/learn/today", { withCredentials: true })
            .then(res => setWords(res.data))
            .catch(err => {
                console.error("단어 불러오기 실패", err);
                alert("서버 오류입니다.");
            });

        // 프로필 이미지 불러오기
        axios.get("/api/myPage", { withCredentials: true })
            .then(res => {
                const user = res.data;
                setProfileImgUrl(user.profileImgUrl || defaultProfileImg);
            })
            .catch(err => {
                console.error("프로필 이미지 불러오기 실패", err);
                setProfileImgUrl(defaultProfileImg);
            });
    }, []);

    const goNext = () => {
        if (index < words.length - 1) {
            setIndex(index + 1);
        } else {
            alert("테스트를 완료하여 스템프를 받아보세요!");
            navigate("/select-learning-type");
        }
    };

    const goPrev = () => {
        if (index > 0) setIndex(index - 1);
    };

    const goToTablePage = () => {
        navigate("/learn/table");
    };

    const toggleMeaning = () => {
        setShowMeaning(!showMeaning);
    };

    const handleSave = async () => {
        const currentWord = words[index];
        try {
            await axios.post("/api/user-voca", {
                spelling: currentWord.spelling,
                meaning: currentWord.meaning
            }, { withCredentials: true });

            alert("단어장에 저장되었습니다!");
        } catch (e) {
            if (e.response?.status === 409) {
                alert("이미 저장된 단어입니다!");
            } else {
                alert("저장 실패!");
                console.error(e);
            }
        }
    };

    const handleLogout = () => {
        if (currentUser?.username) {
            const userKey = getUserKey(currentUser.username);
            localStorage.removeItem("currentUser");
            localStorage.removeItem(userKey);
        }

        axios.post("/logout", {}, { withCredentials: true })
            .then(() => {
                navigate("/login");
            })
            .catch(() => alert("로그아웃 실패"));
    };

    if (words.length === 0) {
        return <div className="card-main">단어를 불러오는 중입니다...</div>;
    }

    const currentWord = words[index];

    return (
        <div className="card-page-container">
            <Header profileImgUrl={profileImgUrl} onLogout={handleLogout} />
            <Logo />

            <div className="card-main">
                <div className="card-box">
                    <div className="english-word">{currentWord.spelling}</div>
                    {showMeaning && (
                        <div className="korean-meaning">{currentWord.meaning}</div>
                    )}
                </div>

                <div className="word-progress">
                    {index + 1} / {words.length}
                </div>

                {index === words.length - 1 && (
                    <div className="complete-message">오늘 학습을 완료했어요!</div>
                )}

                <div className="card-buttons">
                    <button onClick={goPrev}>◀</button>
                    <button onClick={toggleMeaning}>뜻</button>
                    <button onClick={goToTablePage}>≡</button>
                    <button onClick={goNext}>▶</button>
                </div>

                <button className="save-btn" onClick={handleSave}>
                    나만의 단어장 저장
                </button>
            </div>
        </div>
    );
};

export default LearningCardPage;
