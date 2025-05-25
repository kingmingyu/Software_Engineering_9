// src/component/CalendarBlock.js
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarBlock.css';

import MayImg from '../assets/images/TestImg.jpg';
import JunImg from '../assets/images/TestImg2.jpg';
import JulyImg from '../assets/images/TestImg3.jpeg';
import AugustImg from '../assets/images/logo.png';

const COLUMNS = 7;
const ROWS = 6;

// 월별 이미지 매핑
const monthImages = {
    '2025-05': MayImg,
    '2025-06': JunImg,
    '2025-07': JulyImg,
    '2025-08': AugustImg,
};

// 달력 시작 날짜 계산
const getCalendarStartDate = (date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    let day = first.getDay();
    if (day === 0) day = 7;
    first.setDate(first.getDate() - (day - 1));
    return first;
};

// 포맷 함수
const getMonthKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
    ).padStart(2, '0')}`;

const CalendarBlock = ({ selectedDate, onDateChange, currentUser, reloadTrigger }) => {
    const [activeStartDate, setActiveStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    const [completedDate, setCompletedDate] = useState([]);

    useEffect(() => {
        if (!currentUser) return;
        const key = `completedDates_${currentUser.username}`;
        const saved = localStorage.getItem(key);
        setCompletedDate(saved ? JSON.parse(saved) : []);
    }, [currentUser, reloadTrigger]);

    const calendarStart = getCalendarStartDate(activeStartDate);
    const monthKey = getMonthKey(activeStartDate);
    const bgImage = monthImages[monthKey];
    const currentMonth = activeStartDate.getMonth();

    const tileContent = ({ date, view }) => {
        if (view !== 'month' || !bgImage) return null;

        const dateStr = formatDate(date);
        const isInCurrentMonth = date.getMonth() === currentMonth;
        const isCompleted = completedDate.includes(dateStr);

        // 퍼즐 표시 조건:
        // - 현재 달이면: 학습 완료된 날짜만 표시
        // - 이웃 달이면: 학습 여부와 무관하게 표시
        const shouldShowPuzzle =
            (!isInCurrentMonth) || (isInCurrentMonth && isCompleted);

        if (!shouldShowPuzzle) return null;

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
