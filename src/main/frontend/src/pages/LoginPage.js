import './LoginPage.css';
import logo from '../assets/images/logo.png';
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 아이디/비밀번호 찾기 모달 관련 상태
  const [showFindModal, setShowFindModal] = useState(false);
  const [findType, setFindType] = useState('username'); // 'username' or 'password'
  const [findName, setFindName] = useState('');
  const [findEmail, setFindEmail] = useState('');
  const [findId, setFindId] = useState('');
  const [findResult, setFindResult] = useState('');
  const [findError, setFindError] = useState('');

  // 로그인 처리 함수
  const handleLogin = async () => {
    if (!username || !password) {
      alert("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
      const res = await axios.post("/doLogin", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        withCredentials: true
      });

      if (res.status === 200) {
        // 로그인 성공 시 사용자 정보 받아오기
        try {
          const check = await axios.get("/api/main", { withCredentials: true });
          if (check.status === 200) {
            // 사용자 정보 로컬에 저장
            localStorage.setItem("currentUser", JSON.stringify(check.data));

            // 권한에 따라 경로 이동
            if (check.data.role === 'admin') {
              navigate("/admin");
            } else {
              navigate("/main");
            }
          } else {
            alert("인증되지 않은 사용자입니다.");
          }
        } catch (err) {
          alert("세션 확인 실패");
          console.error(err);
        }
      } else {
        alert("로그인 실패!");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        console.error(error);
      }
    }
  };

  // 아이디/비밀번호 찾기 요청
  const handleFind = async () => {
    setFindResult('');
    setFindError('');
    if (findType === 'username') {
      if (!findName || !findEmail) {
        setFindError('이름과 이메일을 모두 입력하세요.');
        return;
      }
      try {
        const res = await axios.get(`/api/find/username`, { params: { name: findName, email: findEmail } });
        setFindResult(`아이디: ${res.data.result}`);
      } catch (err) {
        setFindError(err.response?.data || '일치하는 정보가 없습니다.');
      }
    } else {
      if (!findName || !findId) {
        setFindError('이름과 아이디를 모두 입력하세요.');
        return;
      }
      try {
        const res = await axios.get(`/api/find/password`, { params: { name: findName, username: findId } });
        setFindResult(`비밀번호: ${res.data.result}`);
      } catch (err) {
        setFindError(err.response?.data || '일치하는 정보가 없습니다.');
      }
    }
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

            <p className="find-info" onClick={() => setShowFindModal(true)}>아이디/비밀번호 찾기</p>

            {/*로그인 버튼*/}
            <button type="button" className="login-button" onClick={handleLogin}>로그인</button>

            <p className="signup-link" onClick={() => navigate("/signup")}>회원가입</p>
          </div>
        </div>

        {/* 아이디/비밀번호 찾기 모달 */}
        {showFindModal && (
            <div className="modal-backdrop">
              <div className="modal">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <button
                      className={findType === 'username' ? 'active' : ''}
                      style={{ marginRight: 8 }}
                      onClick={() => { setFindType('username'); setFindResult(''); setFindError(''); }}
                  >아이디 찾기</button>
                  <button
                      className={findType === 'password' ? 'active' : ''}
                      onClick={() => { setFindType('password'); setFindResult(''); setFindError(''); }}
                  >비밀번호 찾기</button>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <input
                      className="input-box"
                      type="text"
                      placeholder="이름"
                      value={findName}
                      onChange={e => setFindName(e.target.value)}
                      style={{ marginBottom: 8, width: '100%' }}
                  />
                  {findType === 'username' ? (
                      <input
                          className="input-box"
                          type="email"
                          placeholder="이메일"
                          value={findEmail}
                          onChange={e => setFindEmail(e.target.value)}
                          style={{ width: '100%' }}
                      />
                  ) : (
                      <input
                          className="input-box"
                          type="text"
                          placeholder="아이디"
                          value={findId}
                          onChange={e => setFindId(e.target.value)}
                          style={{ width: '100%' }}
                      />
                  )}
                </div>
                <button className="login-button" style={{ width: '100%' }} onClick={handleFind}>
                  {findType === 'username' ? '아이디 찾기' : '비밀번호 찾기'}
                </button>
                {findResult && <div style={{ color: 'green', marginTop: 12 }}>{findResult}</div>}
                {findError && <div style={{ color: 'red', marginTop: 12 }}>{findError}</div>}
                <div className="modal-buttons" style={{ marginTop: 16 }}>
                  <button className="cancel-button" onClick={() => {
                    setShowFindModal(false);
                    setFindName(''); setFindEmail(''); setFindId(''); setFindResult(''); setFindError('');
                  }}>닫기</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default LoginPage;

