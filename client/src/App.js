import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer1 from "./components/layout/Footer1";
import Header from "./components/layout/Header";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Header />
      <div className="container container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <Footer1 />
    </Router>
  );
}

export default App;
