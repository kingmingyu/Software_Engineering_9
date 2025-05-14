import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Calendar 기본 스타일
import "./MainPage.css";
import defaultProfileImg from "../assets/images/Generic avatar.png";
import logo from "../assets/images/logo.png";

const MainPage = () => {
    const navigate = useNavigate();

    const [hello, setHello] = useState("");
    const [profileImgUrl, setProfileImgUrl] = useState(defaultProfileImg);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [buttonPosition, setButtonPosition] = useState({learnButtonLeft: 0, learnButtonTop: 0, myVocaButtonLeft: 0, myVocaButtonTop: 0});
    const [logoPosition, setLogoPosition] = useState({left:0, top: 0});

    const[searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const learnButtonX = window.innerWidth / 2-45;
        const learnButtonY = window.innerHeight / 2+170;

        const myVocaButtonX = window.innerWidth / 2+300;
        const myVocaButtonY = window.innerHeight / 2-330;

        const logoX = 5;
        const logoY = 1;

        setButtonPosition({learnButtonLeft: learnButtonX, learnButtonTop: learnButtonY, myVocaButtonLeft: myVocaButtonX, myVocaButtonTop: myVocaButtonY});
        setLogoPosition({ left: logoX, top: logoY });

    }, []);
    useEffect(() => {
        axios.get("/api/main", { withCredentials: true })
            .then((res) => setHello(res.data))
            .catch(() => {
                alert("인증 필요 또는 오류 발생");
                window.location.href = "/login";
            });
    }, []);

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const handleLogout = () => {
        axios.post("/logout")
            .then(() => window.location.href = "/login")
            .catch(() => alert("로그아웃 실패"));
    };

    const onDateChange = (date) => {
        setSelectedDate(date);
        console.log('Selected Date:', date);
    };

    return (
        <div className="main-container">
            <header className="header-bar">
                <div className="logo" style={{position: 'absolute', left: `${logoPosition.left}px`, top: `${logoPosition.top}px` }}>
                    <img src={logo} alt="VOCACino logo" />
                </div>
                <div
                    className="top-right-buttons"
                    style={{position: 'absolute', top: '5px', right: '20px'}}
                >
                    <button className="profile-button" onClick={handleProfileClick}>
                        <img
                            src={profileImgUrl || "/default-profile.png"}
                            alt="프로필"
                            className="profile-image"
                        />
                    </button>
                    <button className="logout-button" onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </header>

            {showProfileMenu && (
                <div className="profile-menu">
                    <p>내 정보</p>
                </div>
            )}

            <div className="main-content">
                <div className="button-container">
                    <button
                        className="learn-button"
                        style = {{
                            position: 'absolute',
                            left: `${buttonPosition.learnButtonLeft}px`,
                            top: `${buttonPosition.learnButtonTop}px`,
                        }}
                        onClick = {() => navigate("/select-learn")}
                    >
                        학습하기
                    </button>

                    <button className="myVoca-button"
                            style = {{
                                position: 'absolute',
                                left: `${buttonPosition.myVocaButtonLeft}px`,
                                top: `${buttonPosition.myVocaButtonTop}px`,
                            }}
                            onClick={() => alert('나만의 단어장')}
                    >
                        나만의 단어장
                    </button>
                </div>
                <div className="calendar-search-container">
                    <input
                        type="text"
                        placeholder="Search"
                        value = {searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            console.log("검색어", e.target.value);
                        }}
                        className="calendar-search-input"
                    />
                </div>
                <div className="calendar-container">
                    <Calendar
                        onChange={onDateChange}
                        value={selectedDate}
                        locale="ko-KR"
                        formatDay={(locale, date) => date.getDate()}
                        minDetail="month"
                        maxDetail="month"
                        navigationLabel={({ date }) =>
                            `${date.getFullYear()}년 ${date.getMonth() + 1}월`
                        }
                        showNeighboringMonth={false}
                        className="react-calendar"
                    />
                </div>
            </div>
        </div>
    );
};
export default MainPage;
