import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/LoginForm";
import BankTransactions from "./components/BankTransactions";
import ExpensesByCategory from "./components/ExpensesByCategory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/transactions" element={<BankTransactions />} />
        <Route path="/expenses" element={<ExpensesByCategory />} />
      </Routes>
    </Router>
  );
}

export default App;
