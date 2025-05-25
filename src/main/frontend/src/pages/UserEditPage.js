import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ← 추가
import logo from "../assets/images/logo.png";
import defaultProfileImg from "../assets/images/Generic avatar.png";
import "./UserEditPage.css";
import Header from "../component/Header";
import Logo from "../component/Logo";

const getUserKey = (username) => `completedDates_${username}`;  // 사용자별 기록 key 생성 함수

const UserEditPage = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        username: ""
    });
    const [profileImgUrl, setProfileImgUrl] = useState("");
    const navigate = useNavigate();  // useNavigate 훅 사용

    useEffect(() => {
        axios.get("/api/myPage", { withCredentials: true })
            .then(res => {
                setUserData(res.data);
                if(res.data.profileImgUrl){
                    setProfileImgUrl(res.data.profileImgUrl);
                } else {
                    setProfileImgUrl(defaultProfileImg);
                }
            })
            .catch(err => {
                alert("사용자 정보를 불러오는데 실패했습니다.");
                console.error(err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleLogout = () => {
        // 현재 로그인한 사용자의 localStorage 기록만 삭제
        if(userData.username){
            const userKey = getUserKey(userData.username);
            localStorage.removeItem("currentUser");
            localStorage.removeItem(userKey);
        }

        axios.post("/logout", {}, { withCredentials: true })
            .then(() => {
                navigate("/login");  // 로그아웃 후 로그인 페이지로 이동
            })
            .catch(() => alert("로그아웃 실패"));
    };

    const handleSave = () => {
        axios.patch("/api/myPage/edit", userData, { withCredentials: true })
            .then(res => {
                if (res.data.includes("로그아웃")) {
                    alert("회원 정보 변경으로 인해 다시 로그인해주세요.");
                    window.location.href = "/login"; // 로그인 페이지로 이동
                } else {
                    alert("수정 완료");
                }
            })
            .catch(err => {
                console.error(err);
                alert("수정 실패");
            });
    };

    return (
        <div className="user-edit-container">
            <div className="header-container">
                <Header profileImgUrl={profileImgUrl} onLogout={handleLogout} />
            </div>
            <div className="logo-container">
                <Logo />
            </div>
            <main className="user-edit-main">
                <div className="form-group">
                    <label>이름</label>
                    <input type="text" name="name" value={userData.name} onChange={handleChange} />
                    <label>이메일</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} />
                    <label>아이디</label>
                    <input type="text" name="username" value={userData.username} onChange={handleChange} />
                </div>
                <button className="save-button" onClick={handleSave}>저장하기</button>
            </main>
        </div>
    );
};

export default UserEditPage;
