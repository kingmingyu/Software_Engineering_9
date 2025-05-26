import React, { useEffect, useState } from "react";
import axios from "axios";
import defaultProfileImg from "../assets/images/Generic avatar.png";
import "./MyPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Logo from "../component/Logo";

// 사용자별 localStorage 키 생성 함수
const getUserKey = (username) => `completedDates_${username}`;

const MyPage = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        profileImgUrl: ""
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/myPage", { withCredentials: true })
            .then(res => setUserData(res.data))
            .catch(err => {
                alert("사용자 정보를 불러오는데 실패했습니다.");
                console.error(err);
            });
    }, []);

    const handleLogout = () => {
        if (currentUser) {
            const userKey = getUserKey(currentUser.username);
            localStorage.removeItem(userKey); // 🔥 해당 사용자 기록만 삭제
        }

        axios.post("/logout")
            .then(() => {
                navigate("/login");
            })
            .catch(() => alert("로그아웃 실패"));
    };

    const handleEditClick = () => {
        navigate("/myPage/edit");
    };

    const handleWithdraw = () => {
        axios.delete("/api/user", { withCredentials: true })
            .then(() => {
                alert("회원 탈퇴가 완료되었습니다.");
                localStorage.clear();
                navigate("/login");
            })
            .catch(err => {
                alert("회원 탈퇴 실패");
                console.error(err);
            });
    };

    return (
        <div className="myPage-container">
            <Header profileImgUrl={userData.profileImgUrl} onLogout={handleLogout} />
            <Logo />

            <main className="myPage-main">
                <div className="mypage-profile-img-container">
                    <img
                        src={userData.profileImgUrl || defaultProfileImg}
                        alt="profile"
                        className="profile-img"
                    />
                    <button className="edit-button" onClick={handleEditClick}>
                        수정하기
                    </button>
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
                                <button className="cancel-button" onClick={() => setShowConfirmModal(false)}>
                                    취소
                                </button>
                                <button className="confirm-button" onClick={handleWithdraw}>
                                    탈퇴
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyPage;

