// src/component/CalendarBlock.js
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../component/CalendarBlock.css";

const CalendarBlock = ({ selectedDate, onDateChange }) => (
    <div className="calendar-wrapper">
        <div className="calendar-container">
            <Calendar
                onChange={onDateChange}
                value={selectedDate}
                locale="ko-kr"
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
);

export default CalendarBlock;
