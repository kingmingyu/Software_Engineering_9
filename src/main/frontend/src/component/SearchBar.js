// src/component/SearchBar.js
import React from "react";
import "../component/SearchBar.css";

const SearchBar = ({ searchQuery, setSearchQuery }) => (
    <div className="calendar-search-container">
        <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="calendar-search-input"
        />
    </div>
);

export default SearchBar;
