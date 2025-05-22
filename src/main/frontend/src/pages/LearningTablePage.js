import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LearningTablePage.css";
import { useNavigate } from "react-router-dom";

const LearningTablePage = () => {
  const [words, setWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/learn/today", { withCredentials: true })
      .then(res => setWords(res.data))
      .catch(err => {
        console.error("단어 불러오기 실패", err);
        alert("서버 오류입니다.");
      });
  }, []);

  const goNext = () => {
      alert("테스트를 완료하여 스템프를 받아보세요!");
      navigate("/select-learning-type"); //학습 유형 선택 화면으로 이동
  };

  return (
    <div className="table-page-container">
      <div className="header-bar">
        <img src="/logo192.png" alt="Logo" className="logo-img" />
        <button className="logout-btn" onClick={() => alert("로그아웃 로직 구현 필요")}>
          로그아웃
        </button>
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
          학습완료하기
        </button>
      </div>
    </div>
  );
};

export default LearningTablePage;
