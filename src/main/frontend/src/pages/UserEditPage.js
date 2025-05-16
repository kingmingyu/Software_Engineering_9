import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/images/logo.png";
import defaultProfileImg from "../assets/images/Generic avatar.png";
import "./UserEditPage.css";

const UserEditPage = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        username: ""
    });

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

    const handleSave = () => {
        axios.put("/api/user", userData, { withCredentials: true })
            .then(() => alert("정보가 저장되었습니다."))
            .catch(err => {
                alert("정보 저장에 실패했습니다.");
                console.error(err);
            });
    };

    return (
        <div className="user-edit-container">
            <header className="user-edit-header">
                <img src={logo} alt="logo" className="user-edit-logo" />
                <div className="user-edit-header-right">
                    <img src={defaultProfileImg} alt="profile" className="user-edit-profile-img" />
                    <button className="logout-button">로그아웃</button>
                </div>
            </header>
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
