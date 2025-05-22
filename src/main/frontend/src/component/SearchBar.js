// src/component/SearchBar.js
import React from "react";
import "../component/SearchBar.css";

const SearchBar = ({ searchQuery, setSearchQuery, onMyVocaClick }) => (
    <div className="search-bar-container">
        <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="calendar-search-input"
        />
        <button className="my-voca-button" onClick={onMyVocaClick}>
            나만의 단어장
        </button>
    </div>
);

export default SearchBar;
