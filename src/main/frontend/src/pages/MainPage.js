// src/pages/MainPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const MainPage = () => {
  const [hello, setHello] = useState("");

  useEffect(() => {
    axios.get("/main")
      .then((res) => setHello(res.data))
      .catch(() => {
        alert("인증 필요 또는 오류 발생");
        window.location.href = "/login";
      });
  }, []);

  return (
    <div>
      <h1>Main Page</h1>
    </div>
  );
};

export default MainPage;
