// src/pages/LearningCardPageUserVoca.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LearningCardPage.css";
import { useNavigate } from "react-router-dom";


const LearningCardPage = () => {
    const [words, setWords] = useState([]);
    const [index, setIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(true);

    useEffect(() => {
        axios.get("/api/user-voca", { withCredentials: true })
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
            alert("저장된 모든 단어를 학습했습니다.");
            navigate("/main"); //메인 화면으로 이동
        }
    };

    const goPrev = () => {
        if (index > 0) setIndex(index - 1);
    };

    const goToTablePage = () => {
            navigate("/my-voca/table");
        };

    if (words.length === 0) {
        return <div className="card-main">단어를 불러오는 중입니다...</div>;
    }

    const handleDelete = async () => {
        const currentWord = words[index];
        if (!currentWord.id) {
            alert("단어 ID가 없어 삭제할 수 없습니다.");
            return;
        }

        try {
            await axios.delete(`/api/user-voca/${currentWord.id}`, {
                withCredentials: true
            });
            alert("단어가 삭제되었습니다!");

            // 단어 리스트에서 삭제한 단어 제거
            const updatedWords = words.filter((_, i) => i !== index);
            setWords(updatedWords);
            setIndex((prev) => Math.max(0, prev - 1));
        } catch (e) {
            alert("삭제 실패!");
            console.error(e);
        }
    };

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
                    <div className="complete-message">저장한 단어를 모두 학습했어요</div>
                )}

                <div className="card-buttons">
                    <button onClick={goPrev}>◀</button>
                    <button onClick={goToTablePage}>≡</button>
                    {/* <button onClick={() => setShowMeaning(!showMeaning)}>≡</button> -> 뜻만보기 */}
                    <button onClick={goNext}>▶</button>
                </div>

                <button className="save-btn" onClick={handleDelete}>
                    삭제하기
                </button>
            </div>
        </div>
    );
};

export default LearningCardPage;

