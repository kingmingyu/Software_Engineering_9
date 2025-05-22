import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from './pages/MainPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import UserEditPage from './pages/UserEditPage';
import AdminPage from './pages/AdminPage';
import LearningTypeSelection from './pages/LearningTypeSelection';
import LearningCardPage from "./pages/LearningCardPage";
import LearningTablePage from "./pages/LearningTablePage";
import WordTestPage from "./pages/WordTestPage";
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/myPage/edit" element={<UserEditPage />} />
          <Route path="/select-learning-type" element={<LearningTypeSelection />} />
          <Route path="/learn/card" element={<LearningCardPage />} />
          <Route path="/learn/table" element={<LearningTablePage />} />
          <Route path="/word-test" element={<WordTestPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
