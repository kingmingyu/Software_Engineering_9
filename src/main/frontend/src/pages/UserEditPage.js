import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/images/logo.png";
import defaultProfileImg from "../assets/images/Generic avatar.png";
import "./UserEditPage.css";
import Header from "../component/Header";
import Logo from "../component/Logo";

const UserEditPage = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        username: ""
    });
    const [profileImgUrl, setProfileImgUrl] = useState("");

    useEffect(() => {
        axios.get("/api/myPage", { withCredentials: true })
            .then(res => setUserData(res.data))
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
            axios
                .post("/logout")
                .then(() => (window.location.href = "/login"))
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
            <Header profileImgUrl={profileImgUrl} onLogout={handleLogout} />
            <Logo />
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
