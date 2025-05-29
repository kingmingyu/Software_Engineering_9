// src/pages/WordTestPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WordTestPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Logo from "../component/Logo";

const WordTestPage = () => {
    const [words, setWords] = useState([]);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [isTestFinished, setIsTestFinished] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [completedDates, setCompletedDates] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const navigate = useNavigate();

    const getToday = () => new Date().toISOString().split("T")[0];

    const handleLogout = () => {
        axios.post("/logout").then(() => {
            setCurrentUser(null);
            navigate("/login");
        }).catch(() => alert("로그아웃 실패"));
    };

    useEffect(() => {
        axios.get("/api/main", { withCredentials: true })
            .then((res) => {
                let user = res.data;
                if (Array.isArray(user)) {
                    user = { username: user.join("") };
                } else if (typeof user === "string") {
                    user = { username: user };
                }
                console.log("로그인 유저 정보:", user);
                setCurrentUser(user);
            })
            .catch(() => {
                alert("로그인 상태 확인 실패");
                navigate("/login");
            });
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        setCompletedDates([]);

        axios.get(`/api/progress/${currentUser.username}`, { withCredentials: true })
            .then(res => {
                setCompletedDates(res.data || []);
            })
            .catch(() => {
                alert("완료 날짜를 불러오지 못했습니다.");
            });
    }, [currentUser, reloadTrigger]);

    const getUniqueRandomSubset = (array, count) => {
        const uniqueMap = new Map();
        array.forEach((item) => {
            uniqueMap.set(item.spelling, item);
        });
        const uniqueArray = Array.from(uniqueMap.values());
        const shuffled = [...uniqueArray].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    };

    useEffect(() => {
        if (!currentUser) return;

        axios.get("/api/learn/today", { withCredentials: true })
            .then((res) => {
                const fullList = res.data;
                const testList = getUniqueRandomSubset(fullList, 20);
                setWords(testList);
            })
            .catch(() => alert("단어를 불러올 수 없습니다."));
    }, [currentUser]);

    useEffect(() => {
        if (!isTestFinished || !currentUser) return;

        const today = new Date().toISOString().split("T")[0];
        const userKey = `completedDates_${currentUser.username}`;

        // ✅ 로컬스토리지 저장
        const saved = JSON.parse(localStorage.getItem(userKey) || "[]");
        if (!saved.includes(today)) {
            const updated = [...saved, today];
            localStorage.setItem(userKey, JSON.stringify(updated));
            setCompletedDates(updated);
        }

        // ✅ 서버에 학습 날짜 저장
        axios.post(
            `/api/progress/${currentUser.username}`,
            {data: today},
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            }
        )
            .then(() => {
                setCompletedDates(prev => [...prev, today]);
                setReloadTrigger(prev => prev + 1); // 캘린더 새로고침
            })
            .catch(() => {
                //alert("학습 날짜 저장 실패");
            });

        // ✅ 점수가 18 이상이면 학습 데이터 증가
        const correctCount = words.length - wrongAnswers.length;
        if (correctCount >= 18) {
            axios.post("/api/learn/increase", {}, { withCredentials: true })
                .then(() => console.log("✅ 학습 데이터 1 증가 완료"))
                .catch((err) => {
                    console.warn("❌ 학습 데이터 증가 실패", err);
                });
        }

    }, [isTestFinished, currentUser]);


    const handleSubmit = (e) => {
        e.preventDefault();

        const correct = words[index].spelling.toLowerCase().trim();
        const userAnswer = answer.toLowerCase().trim();
        const isCorrect = userAnswer === correct;

        if (!isCorrect) {
            setWrongAnswers(prev => [...prev, {
                meaning: words[index].meaning,
                correct: words[index].spelling,
                user: userAnswer,
            }]);
        }

        setAnswer("");

        if (index < words.length - 1) {
            setIndex(prev => prev + 1);
        } else {
            setIsTestFinished(true);
        }
    };

    if (words.length === 0) return <div className="loading">로딩 중...</div>;

    return (
        <div className="test-container">
            <div className="logo-area">
                <Header profileImgUrl={currentUser?.profileImgUrl} onLogout={handleLogout} />
                <Logo />
            </div>

            {isTestFinished ? (
                <div className="result-summary">
                    <h2>테스트 완료!</h2>
                    <p>최종 점수: {words.length - wrongAnswers.length} / {words.length}</p>
                    {words.length - wrongAnswers.length >= 18 ? (
                        <p className="pass">✅ 합격입니다! 축하해요!</p>
                    ) : (
                        <p className="fail">❌ 불합격입니다. 다시 도전해보세요!</p>
                    )}
                    {wrongAnswers.length > 0 ? (
                        <table className="wrong-table">
                            <thead>
                            <tr>
                                <th>뜻</th>
                                <th>정답</th>
                                <th>내 답안</th>
                            </tr>
                            </thead>
                            <tbody>
                            {wrongAnswers.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.meaning}</td>
                                    <td>{item.correct}</td>
                                    <td>{item.user}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>👏 모든 문제를 맞췄어요!</p>
                    )}

                    <div className="result-buttons">
                        <button onClick={() => navigate("/select-learning-type")}>🔁 다시 학습하기</button>
                        <button onClick={() => navigate("/main")}>🏠 메인으로 돌아가기</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="test-card">
                        <div className="meaning">{words[index].meaning}</div>
                    </div>

                    <form onSubmit={handleSubmit} className="answer-form">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="정답입력(스펠링)"
                        />
                        <button type="submit">Submit</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default WordTestPage;
