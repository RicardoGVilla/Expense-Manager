import { useState, useEffect } from "react";
import axios from "axios";
import ExpensesByCategory from "./ExpensesByCategory";

const BankTransactions = ({ accessToken }) => {
  const [transactions, setTransactions] = useState([]);
  const [showExpensesByCategory, setShowExpensesByCategory] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/v1/plaid/transactions?access_token=${accessToken}`
      )
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.log("Error fetching transactions:", error);
      });
  }, [accessToken]);

  const showExpenses = () => {
    setShowExpensesByCategory(true);
  };

  const goBack = () => {
    setShowExpensesByCategory(false);
  };

  const expensesByCategory = (() => {
    const accumulator = {};
    transactions.forEach((transaction) => {
      let addedToCategory = false;
      transaction.category.forEach((category) => {
        if (!addedToCategory && !accumulator[category]) {
          accumulator[category] = transaction.amount;
          addedToCategory = true;
        }
      });
    });
    return accumulator;
  })();

  return (
    <div>
      {!showExpensesByCategory && (
        <div className="transactions-container">
          <h2 className="title-transactions">Your Bank Transactions</h2>
          <button onClick={showExpenses}>Expenses by Category</button>
          {transactions && transactions.length > 0 ? (
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
                    <td>{transaction.amount}</td>
                    <td>{transaction.category.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading Your Bank Transactions...</p>
          )}
        </div>
      )}
      {showExpensesByCategory && (
        <ExpensesByCategory
          expensesByCategory={expensesByCategory}
          goBack={goBack}
        />
      )}
    </div>
  );
};

export default BankTransactions;
