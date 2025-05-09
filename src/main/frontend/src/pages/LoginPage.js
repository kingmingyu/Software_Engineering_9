import './LoginPage.css';
import logo from '../assets/images/logo.png';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function LoginPage() {
  const [hello, setHello] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 추가

  // 로그인 처리 함수
  const handleLogin = async () => {
    if (!username || !password) {
      alert("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    axios.post("/doLogin", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      withCredentials: true
    })
    .then(async (res) => {
      if (res.status === 200) {
        try {
          const check = await axios.get("/user", { withCredentials: true });
          if (check.status === 200) {
            navigate("/main");
          } else {
            alert("인증되지 않은 사용자입니다.");
          }
        } catch {
          alert("세션 확인 실패");
        }
      } else {
        alert("로그인 실패!");
      }
    });
  };

  return (
    <div className="login-container">
      <header className="header-bar" />
      <div className="content">
        <div className="left-section">
          <img src={logo} alt="VOCACino Logo" className="logo" />
          <p className="slogan">하루 한 잔처럼 가볍게 단어 학습</p>
        </div>
        <div className="right-section">
          <h2 className="login-title">LOGIN</h2>

          {/* 아이디 입력 */}
          <input
            className="input-box"
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* 비밀번호 입력 */}
          <input
            className="input-box"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="find-info">아이디/비밀번호 찾기</p>

          {/*로그인 버튼*/}
          <button type="button" className="login-button" onClick={handleLogin}>로그인</button>

          <p className="signup-link">회원가입</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
