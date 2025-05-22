// src/pages/LearningTypeSelection.js
import React from "react";
import "./LearningTypeSelection.css";
import Header from "../component/Header";
import Logo from "../component/Logo";
import { useNavigate } from "react-router-dom";

const LearningTypeSelection = ({ onLearn, onTest, profileImgUrl, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="learning-selection-container">
            <main className="selection-main">
                <div className="selection-box">
                    <button
                        className="selection-button"
                        onClick={() => navigate("/learn/card")}
                    >
                        단어 학습하기
                    </button>
                    <button
                        className="selection-button"
                        onClick={() => navigate("/word-test")}
                    >
                        단어 테스트하기
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LearningTypeSelection;