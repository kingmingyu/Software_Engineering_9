// src/pages/LearningCardPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LearningCardPage.css";
import { useNavigate } from "react-router-dom";


const LearningCardPage = () => {
    const [words, setWords] = useState([]);
    const [index, setIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(true);

    useEffect(() => {
        axios.get("/api/learn/today", { withCredentials: true })
            .then(res => setWords(res.data))
            .catch(err => {
                console.error("단어 불러오기 실패", err);
                alert("서버 오류입니다.");
            });
    }, []);

    const navigate = useNavigate();

    const goNext = () => {
        if (index < words.length - 1) {
            setIndex(index + 1);
        } else {
            // 마지막 단어일 경우: 다음 페이지로 이동
            alert("테스트를 완료하여 스템프를 받아보세요!");
            navigate("/select-learning-type"); //학습 유형 선택 화면으로 이동
        }
    };

    const goPrev = () => {
        if (index > 0) setIndex(index - 1);
    };

    const goToTablePage = () => {
            navigate("/learn/table");
        };

    if (words.length === 0) {
        return <div className="card-main">단어를 불러오는 중입니다...</div>;
    }

    return (
        <div className="card-page-container">
            {/* 상단 헤더 */}
            <div className="header-bar">
                <img src="/logo192.png" alt="Logo" className="logo-img" />
                <button className="logout-btn" onClick={() => alert("로그아웃 로직 구현 필요")}>
                    로그아웃
                </button>
            </div>

            {/* 메인 카드 영역 */}
            <div className="card-main">
                <div className="card-box">
                    <div className="english-word">{words[index].spelling}</div>
                    {showMeaning && <div className="korean-meaning">{words[index].meaning}</div>}
                </div>

                <div className="word-progress">
                    {index + 1} / {words.length}
                </div>

                {index === words.length - 1 && (
                    <div className="complete-message">오늘 학습을 완료했어요!</div>
                )}

                <div className="card-buttons">
                    <button onClick={goPrev}>◀</button>
                    <button onClick={goToTablePage}>≡</button>
                    {/* <button onClick={() => setShowMeaning(!showMeaning)}>≡</button> -> 뜻만보기 */}
                    <button onClick={goNext}>▶</button>
                </div>

                <button className="save-btn" onClick={() => alert("단어장 저장 로직 구현 예정")}>
                    나만의 단어장 저장
                </button>
            </div>
        </div>
    );
};

export default LearningCardPage;

