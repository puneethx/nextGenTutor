import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from "./pages/Home/Home"
import Chat from "./components/ChatApp/ChatApp"
import Model from "./react3/model"
import Model2 from "./react3-model2/model"

const App = () => {

  return (
    <Router>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/biology" element={<Model/>}/>
          <Route path="/chemistry" element={<Model/>}/>
          <Route path="/physics" element={<Model2/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
