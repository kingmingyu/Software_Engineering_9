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
    const navigate = useNavigate();

    // ✅ 사용자별 저장 키 생성 함수
    const getUserKey = (username) => `completedDates_${username}`;

    // ✅ 로그아웃 시 현재 유저 기록만 삭제
    const handleLogout = () => {
        if (currentUser) {
            const userKey = getUserKey(currentUser.username);
            localStorage.removeItem("currentUser");
            localStorage.removeItem(userKey); // 🔥 해당 사용자 기록만 삭제
        }

        axios.post("/logout")
            .then(() => {
                setCurrentUser(null);
                setCompletedDates([]);
                navigate("/login");
            })
            .catch(() => alert("로그아웃 실패"));
    };

    // ✅ 로그인 유저 불러오기
    useEffect(() => {
        axios.get("/api/main", { withCredentials: true })
            .then((res) => {
                const user = res.data;
                setCurrentUser(user);
                localStorage.setItem("currentUser", JSON.stringify(user));
            })
            .catch(() => {
                alert("로그인 상태 확인 실패");
                navigate("/login");
            });
    }, []);

    // ✅ 로그인 후 해당 유저의 기록 불러오기
    useEffect(() => {
        if (currentUser) {
            const userKey = getUserKey(currentUser.username);
            const saved = JSON.parse(localStorage.getItem(userKey) || "[]");
            setCompletedDates(saved);
        }
    }, [currentUser]);

    // ✅ 중복 제거 후 랜덤 20개 단어 추출
    const getUniqueRandomSubset = (array, count) => {
        const uniqueMap = new Map();
        array.forEach((item) => {
            uniqueMap.set(item.spelling, item);
        });
        const uniqueArray = Array.from(uniqueMap.values());
        const shuffled = [...uniqueArray].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    };

    // ✅ 단어 리스트 가져오기
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

    // ✅ 테스트 완료 시 날짜 저장
    useEffect(() => {
        if (isTestFinished && currentUser) {
            const today = new Date().toISOString().split("T")[0];
            const userKey = getUserKey(currentUser.username);
            const saved = JSON.parse(localStorage.getItem(userKey) || "[]");

            if (!saved.includes(today)) {
                const updated = [...saved, today];
                localStorage.setItem(userKey, JSON.stringify(updated));
                setCompletedDates(updated); // 상태도 반영
            }
        }
    }, [isTestFinished, currentUser]);

    // ✅ 정답 제출
    const [result, setResult] = useState(null); // true/false/null
    const navigate = useNavigate();
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [isTestFinished, setIsTestFinished] = useState(false);



    function getUniqueRandomSubset(array, count) {
      // 1. 중복 제거
      const uniqueMap = new Map();
      array.forEach((item) => {
        uniqueMap.set(item.spelling, item);
      });
      const uniqueArray = Array.from(uniqueMap.values());
      // 2. 랜덤 셔플
      const shuffled = [...uniqueArray].sort(() => Math.random() - 0.5);
      // 3. 원하는 개수만 추출
      return shuffled.slice(0, count);
    }

    useEffect(() => {
      axios.get("/api/learn/today", { withCredentials: true })
        .then(res => {
          const fullList = res.data;
          const testList = getUniqueRandomSubset(fullList, 20); //중복 제거 후 랜덤 추출
          setWords(testList);
        })
        .catch(() => alert("단어를 불러올 수 없습니다."));
    }, []);


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

                user: userAnswer

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
                    <p>
                        최종 점수: {words.length - wrongAnswers.length} / {words.length}
                    </p>

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

    const nextWord = () => {
        setResult(null);
        setAnswer("");
        if (index < words.length - 1) {
            setIndex(index + 1);
        } else {
            alert("오늘 테스트가 끝났습니다!");
        }
    };


    if (words.length === 0) return <div className="loading">로딩 중...</div>;

    return (
      <div className="test-container">
        {isTestFinished ? (
          // 테스트 완료 시 결과 화면
          <div className="result-summary">
            <h2>테스트 완료!</h2>

            <p>
              최종 점수: {words.length - wrongAnswers.length} / {words.length}
            </p>

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

            {/* 버튼 추가 */}
            <div className="result-buttons">
              <button onClick={() => navigate("/select-learning-type")}>🔁 다시 학습하기</button>
              <button onClick={() => navigate("/main")}>🏠 메인으로 돌아가기</button>
            </div>
          </div>
        ) : (
          // 테스트 진행 중 화면
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



