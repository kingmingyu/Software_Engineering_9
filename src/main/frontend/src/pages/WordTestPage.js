// src/pages/WordTestPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WordTestPage.css";
import { useNavigate } from "react-router-dom";


const WordTestPage = () => {
    const [words, setWords] = useState([]);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState("");
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
