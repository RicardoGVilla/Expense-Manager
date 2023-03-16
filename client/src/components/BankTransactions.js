import { useState, useEffect } from "react";
import axios from "axios";

const BankTransactions = ({ accessToken }) => {
  console.log(accessToken);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/v1/plaid/transactions?access_token=${accessToken}`
      )
      .then((response) => {
        setTransactions(response.data.transactions);
      })
      .catch((error) => {
        console.log("Error fetching transactions:", error);
      });
  }, [accessToken]);

  return (
    <div>
      <h2>Your Bank Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.transaction_id}>
            {transaction.name} - {transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BankTransactions;
