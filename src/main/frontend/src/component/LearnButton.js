import React from "react";
import "./LearnButton.css";

const LearnButton = ({ onClick }) => {
    return (
        <button className="learn-button" onClick={onClick}>
            학습하기
        </button>
    );
};

export default LearnButton;
