import { useState, useEffect } from "react";
import axios from "axios";

const BankTransactions = ({ accessToken }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpensesByCategory, setShowExpensesByCategory] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/v1/plaid/transactions?access_token=${accessToken}`
      )
      .then((response) => {
        setTransactions(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching transactions:", error);
        setIsLoading(false);
      });
  }, [accessToken]);

  const expensesByCategory = transactions.reduce((accumulator, transaction) => {
    const category = transaction.category[0]; // Only consider the first category
    const amount = Math.abs(transaction.amount);

    if (!accumulator[category]) {
      accumulator[category] = amount;
    } else {
      accumulator[category] += amount;
    }

    return accumulator;
  }, {});

  const totalExpenses = Object.values(expensesByCategory).reduce(
    (total, expense) => total + expense,
    0
  );

  const showExpenses = () => {
    setShowExpensesByCategory(true);
  };

  const goBack = () => {
    setShowExpensesByCategory(false);
  };

  return (
    <div>
      {!showExpensesByCategory && (
        <div className="transactions-container">
          <h2 className="title-transactions">Your Bank Transactions</h2>
          <button onClick={showExpenses}>Expenses by Category</button>
          {isLoading ? (
            <p>Loading Your Bank Transactions...</p>
          ) : transactions && transactions.length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.transaction_id}>
                      <td>{transaction.date}</td>
                      <td>{transaction.name}</td>
                      <td>{Math.abs(transaction.amount)}</td>
                      <td>{transaction.category[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Total Expenses: {totalExpenses.toFixed(2)}</p>
            </>
          ) : (
            <p>No Transactions Found...</p>
          )}
        </div>
      )}
      {showExpensesByCategory && (
        <div className="transactions-container">
          <h2 className="title-transactions">Expenses by Category</h2>
          <button onClick={goBack}>Back to Transactions</button>
          {Object.entries(expensesByCategory).length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(expensesByCategory).map(
                    ([category, total]) => (
                      <tr key={category}>
                        <td>{category}</td>
                        <td>{total.toFixed(2)}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <p>No Expenses by Category Found...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BankTransactions;
