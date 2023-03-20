import { useState, useEffect } from "react";
import axios from "axios";

const BankTransactions = ({ accessToken }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/v1/plaid/transactions?access_token=${accessToken}`
      )
      .then((response) => {
        console.log(response);
        setTransactions(response.data);
        console.log(transactions);
      })
      .catch((error) => {
        console.log("Error fetching transactions:", error);
      });
  }, [accessToken]);

  return (
    <div>
      <div className="transactions-container">
        <h2 className="title-transactions">Your Bank Transactions</h2>
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
    </div>
  );
};

export default BankTransactions;
