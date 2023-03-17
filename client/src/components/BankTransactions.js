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
      <h2>Your Bank Transactions</h2>
      {transactions && transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.transaction_id}>
              {transaction.name} - {transaction.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading Your Bank Transactions...</p>
      )}
    </div>
  );
};

export default BankTransactions;
