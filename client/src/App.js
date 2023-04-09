import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/LoginForm";
import BankTransactions from "./components/BankTransactions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/transactions" element={<BankTransactions />} />
      </Routes>
    </Router>
  );
}

export default App;
