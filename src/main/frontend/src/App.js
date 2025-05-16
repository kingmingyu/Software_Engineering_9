import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from './pages/MainPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import UserEditPage from './pages/UserEditPage';
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/myPage/edit" element={<UserEditPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
