// src/component/CalendarBlock.js

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarBlock.css';

import MayImg from '../assets/images/TestImg.jpg';
import JunImg from '../assets/images/TestImg2.jpg';
import JulyImg from '../assets/images/TestImg3.jpeg';
import AugustImg from '../assets/images/logo.png';
import axios from 'axios';

const COLUMNS = 7;
const ROWS = 6;

const monthImages = {
    '2025-05': MayImg,
    '2025-06': JunImg,
    '2025-07': JulyImg,
    '2025-08': AugustImg,
};

const getCalendarStartDate = (date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    let day = first.getDay();
    if (day === 0) day = 7;
    first.setDate(first.getDate() - (day - 1));
    return first;
};

const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
    ).padStart(2, '0')}`;

const getMonthKey = (dateStr) => dateStr.slice(0, 7); // "2025-05-28" -> "2025-05"

const CalendarBlock = ({ selectedDate, onDateChange, currentUser, reloadTrigger }) => {
    const [activeStartDate, setActiveStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    const [completedDates, setCompletedDates] = useState([]);

    useEffect(() => {
        setCompletedDates([]);
        if (!currentUser) return;

        axios
            .get(`/api/progress/${currentUser.username}`)
            .then((res) => {
                // res.data는 단순한 날짜 문자열 배열 (예: ["2025-05-28", "2025-05-29"])
                setCompletedDates(res.data || []);
            })
            .catch((err) => {
                console.error("날짜 불러오기 오류:", err);
                alert("완료 날짜를 불러오지 못했습니다.");
            });
    }, [currentUser, reloadTrigger]);

    const calendarStart = getCalendarStartDate(activeStartDate);
    const currentMonth = activeStartDate.getMonth();
    const displayMonthKey = getMonthKey(formatDate(activeStartDate));
    const bgImage = monthImages[displayMonthKey];

    const tileContent = ({ date, view }) => {
        if (view !== 'month' || !bgImage) return null;

        const dateStr = formatDate(date);
        const isCompleted = completedDates.includes(dateStr);
        const isInCurrentMonth = date.getMonth() === currentMonth;

        // 현재 달이면 완료된 날짜만 표시, 이웃 달이면 무조건 표시
        if (isInCurrentMonth && !isCompleted) return null;

        const daysFromStart = Math.floor((date - calendarStart) / (1000 * 60 * 60 * 24));
        if (daysFromStart < 0 || daysFromStart >= COLUMNS * ROWS) return null;

        const row = Math.floor(daysFromStart / COLUMNS);
        const col = daysFromStart % COLUMNS;

        return (
            <div
                className="puzzle-piece"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: `${COLUMNS * 100}% ${ROWS * 100}%`,
                    backgroundPosition: `${(col / (COLUMNS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                }}
            />
        );
    };

    return (
        <div className="calendar-wrapper">
            <Calendar
                key={currentUser?.username}
                onChange={onDateChange}
                value={selectedDate}
                locale="ko-KR"
                minDetail="month"
                maxDetail="month"
                calendarType="iso8601"
                navigationLabel={({ date }) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
                showNeighboringMonth={true}
                formatDay={(locale, date) => date.getDate().toString()}
                tileContent={tileContent}
                onActiveStartDateChange={({ activeStartDate }) =>
                    setActiveStartDate(activeStartDate)
                }
                className="react-calendar"
            />
        </div>
    );
};

export default CalendarBlock;

/*
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarBlock.css';

import MayImg from '../assets/images/TestImg.jpg';
import JunImg from '../assets/images/TestImg2.jpg';
import JulyImg from '../assets/images/TestImg3.jpeg';
import AugustImg from '../assets/images/logo.png';
import axios from 'axios';

const COLUMNS = 7;
const ROWS = 6;

const monthImages = {
    '2025-05': MayImg,
    '2025-06': JunImg,
    '2025-07': JulyImg,
    '2025-08': AugustImg,
};

const getCalendarStartDate = (date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    let day = first.getDay();
    if (day === 0) day = 7;
    first.setDate(first.getDate() - (day - 1));
    return first;
};

const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
    ).padStart(2, '0')}`;

const getMonthKey = (dateStr) => dateStr.slice(0, 7); // "2025-05-28" -> "2025-05"

const CalendarBlock = ({ selectedDate, onDateChange, currentUser, reloadTrigger }) => {
    const [activeStartDate, setActiveStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    const [completedDates, setCompletedDates] = useState([]);

    useEffect(() => {
        setCompletedDates([]);
        if (!currentUser) return;

        axios
            .get(`/api/progress/${currentUser.username}`)
            .then((res) => {
                setCompletedDates(res.data.completedDates || []);
            })
            .catch((err) => {
                console.error("날짜 불러오기 오류:", err);
                alert("완료 날짜를 불러오지 못했습니다.");
            });
    }, [currentUser, reloadTrigger]);

    const calendarStart = getCalendarStartDate(activeStartDate);
    const currentMonth = activeStartDate.getMonth();
    const displayMonthKey = getMonthKey(formatDate(activeStartDate));
    const bgImage = monthImages[displayMonthKey];

    const tileContent = ({ date, view }) => {
        if (view !== 'month' || !bgImage) return null;

        const dateStr = formatDate(date);
        const isCompleted = completedDates.includes(dateStr);
        const isInCurrentMonth = date.getMonth() === currentMonth;

        // 현재 달이면 완료된 날짜만 표시, 이웃 달이면 무조건 표시
        if (isInCurrentMonth && !isCompleted) return null;

        const daysFromStart = Math.floor((date - calendarStart) / (1000 * 60 * 60 * 24));
        if (daysFromStart < 0 || daysFromStart >= COLUMNS * ROWS) return null;

        const row = Math.floor(daysFromStart / COLUMNS);
        const col = daysFromStart % COLUMNS;

        return (
            <div
                className="puzzle-piece"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: `${COLUMNS * 100}% ${ROWS * 100}%`,
                    backgroundPosition: `${(col / (COLUMNS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                }}
            />
        );
    };

    return (
        <div className="calendar-wrapper">
            <Calendar
                key={currentUser?.username}
                onChange={onDateChange}
                value={selectedDate}
                locale="ko-KR"
                minDetail="month"
                maxDetail="month"
                calendarType="iso8601"
                navigationLabel={({ date }) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
                showNeighboringMonth={true}
                formatDay={(locale, date) => date.getDate().toString()}
                tileContent={tileContent}
                onActiveStartDateChange={({ activeStartDate }) =>
                    setActiveStartDate(activeStartDate)
                }
                className="react-calendar"
            />
        </div>
    );
};

export default CalendarBlock;


 */