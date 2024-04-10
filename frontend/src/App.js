import React from "react";
import Loginsignup from "./LoginSignup.jsx";
import DrawingBoard from "./components/DrawingBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginsignup />} />
        <Route path="/DrawingBoard" element={<DrawingBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
