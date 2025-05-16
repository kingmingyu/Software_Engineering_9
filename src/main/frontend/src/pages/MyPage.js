import React, { useEffect, useState } from "react";
import axios from "axios";
import defaultProfileImg from "../assets/images/Generic avatar.png";
import logo from "../assets/images/logo.png";
import "./MyPage.css";
import { useNavigate } from "react-router-dom";


const MyPage = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        username: "",
        password: ""
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false); // 모달 상태

    useEffect(() => {
        axios.get("/api/myPage", { withCredentials: true })
            .then(res => setUserData(res.data))
            .catch(err => {
                alert("사용자 정보를 불러오는데 실패했습니다.");
                console.error(err);
            });
    }, []);

    const handleLogout = () => {
        axios.post("/logout", {}, { withCredentials: true })
            .then(() => window.location.href = "/login")
            .catch(() => alert("로그아웃 실패"));
    };

    const navigate = useNavigate();
    const handleEditClick = () => {
        navigate("/myPage/edit"); // 이 경로는 라우터에 등록된 edit 페이지 경로
    };

    const handleWithdraw = () => {
        // 실제 회원탈퇴 API 호출
        axios.delete("/api/user", { withCredentials: true })
            .then(() => {
                alert("회원 탈퇴가 완료되었습니다.");
                window.location.href = "/login"; // 로그인페이지로 이동
            })
            .catch(err => {
                alert("회원 탈퇴 실패");
                console.error(err);
            });
    };

    return (
        <div className="myPage-container">
            <header className="myPage-header">
                <img src={logo} alt="logo" className="myPage-logo" />
                <div className="myPage-header-right">
                    <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                </div>
            </header>

            <main className="myPage-main">
                <div className="profile-img-container">
                    <img src={defaultProfileImg} alt="profile" className="profile-img" />
                    <button className="edit-button" onClick={handleEditClick}>수정하기</button>
                </div>
                <div className="user-info-form">
                    <label>이름</label>
                    <input type="text" value={userData.name} disabled />
                    <label>이메일</label>
                    <input type="email" value={userData.email} disabled />
                    <label>아이디</label>
                    <input type="text" value={userData.username} disabled />
                </div>
                <button className="withdraw-button" onClick={() => setShowConfirmModal(true)}>
                    회원탈퇴
                </button>

                {showConfirmModal && (
                    <div className="modal-backdrop">
                        <div className="modal">
                            <p>회원을 탈퇴하시겠습니까?</p>
                            <div className="modal-buttons">
                                <button className="cancel-button" onClick={() => setShowConfirmModal(false)}>취소</button>
                                <button className="confirm-button" onClick={handleWithdraw}>탈퇴</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyPage;