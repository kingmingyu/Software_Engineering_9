import './SignupPage.css';
import logo from '../assets/images/logo.png';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // 유효성 검사 함수들
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{8,16}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^[a-zA-Z0-9]{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async () => {
    // 입력값 유효성 검사
    if (!email || !name || !username || !password) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    // 이메일 형식 검사
    if (!validateEmail(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    // 아이디 형식 검사
    if (!validateUsername(username)) {
      alert("아이디는 영문, 숫자 8~16자리로 입력해주세요.");
      return;
    }

    // 비밀번호 형식 검사
    if (!validatePassword(password)) {
      alert("비밀번호는 영문, 숫자 8~16자리로 입력해주세요.");
      return;
    }

    const data = { email, name, username, password };

    try {
      const res = await axios.post("/signup", data);
      if (res.status === 200) {
        alert("회원가입 성공!");
        navigate('/login');
      } else {
        alert("회원가입 실패");
      }
    } catch (err) {
      if (err.response?.status === 409) {
          alert(err.response.data);  // => "이미 존재하는 이메일입니다."
        } else {
          alert("회원가입 중 오류가 발생했습니다.");
        }
    }
  };

  return (
    <div className="signup-container">
      <header className="header-bar" />
      <div className="content">
        <div className="left-section">
          <img src={logo} alt="VOCACino Logo" className="logo" />
          <p className="slogan">하루 한 잔처럼 가볍게 단어 학습</p>
        </div>
        <div className="right-section">
          <h2 className="signup-title">SIGN UP</h2>

          <input
            className="input-box"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input-box"
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input-box"
            type="text"
            placeholder="아이디 (영문, 숫자 8~16자)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input-box"
            type="password"
            placeholder="비밀번호 (영문, 숫자 8~16자)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="button" className="signup-button" onClick={handleSignup}>
            회원가입하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
