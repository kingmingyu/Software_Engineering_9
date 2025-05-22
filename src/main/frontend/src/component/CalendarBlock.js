// src/component/CalendarBlock.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarBlock.css';

import MayImg from '../assets/images/TestImg.jpg';
import JunImg from '../assets/images/TestImg2.jpg';
import JulyImg from '../assets/images/TestImg3.jpeg';
import AgustImg from '../assets/images/logo.png';

const COLUMNS = 7;
const ROWS = 6;

// 달별 이미지 매핑
const monthImages = {
    '2025-05': MayImg,
    '2025-06': JunImg,
    '2025-07': JulyImg,
    '2025-08': AgustImg,
};

// 달력 시작 날짜 계산 (월요일 시작 기준)
const getCalendarStartDate = (date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    let day = first.getDay();
    if (day === 0) day = 7; // 일요일은 7로 변경
    first.setDate(first.getDate() - (day - 1));
    return first;
};

// 날짜를 YYYY-MM 형식으로 변환
const getMonthKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

// 날짜를 YYYY-MM-DD 형식으로 변환
const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
    ).padStart(2, '0')}`;

const specialDates = [
    '2025-05-01',
    '2025-05-02',
    '2025-05-10',
    '2025-05-11',
    '2025-05-21',
    '2025-06-09',
    '2025-06-10',
    '2025-06-11',
    '2025-06-12',
    '2025-06-13',
    '2025-06-14',
    '2025-06-15',
    '2025-08-04',
    '2025-08-05',
    '2025-08-06',
    '2025-08-07',
    '2025-08-08',
    '2025-08-09',
    '2025-08-10',
];

const CalendarImg = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeStartDate, setActiveStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    const calendarStart = getCalendarStartDate(activeStartDate);
    const monthKey = getMonthKey(activeStartDate);
    const bgImage = monthImages[monthKey];
    const currentMonth = activeStartDate.getMonth();

    const tileContent = ({ date, view }) => {
        if (view !== 'month' || !bgImage) return null;

        const dateStr = formatDate(date);
        const isInCurrentMonth = date.getMonth() === currentMonth;
        const shouldShowPuzzle =
            !isInCurrentMonth || specialDates.includes(dateStr); // 💡 현재 달이 아니거나, 지정된 날짜인 경우만 표시

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
            <div className="calendar-container">
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    locale="ko-KR"
                    minDetail="month"
                    maxDetail="month"
                    calendarType="iso8601" // 월요일 시작
                    navigationLabel={({ date }) =>
                        `${date.getFullYear()}년 ${date.getMonth() + 1}월`
                    }
                    showNeighboringMonth={true}
                    formatDay={(locale, date) => date.getDate().toString()}
                    tileContent={tileContent}
                    onActiveStartDateChange={({ activeStartDate }) =>
                        setActiveStartDate(activeStartDate)
                    }
                    className="react-calendar"
                />
            </div>
        </div>
    );
};

export default CalendarImg;



