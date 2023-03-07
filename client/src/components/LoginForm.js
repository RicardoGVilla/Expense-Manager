import React, { useState, useEffect } from "react";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Fetch the CSRF token from the server

    axios
      .get("http://localhost:3001/api/v1/csrf_token")
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (csrfToken) {
      console.log("CSRF token found:", csrfToken);

      axios
        .post(
          "http://localhost:3001/users/sign_in",
          {
            user: {
              email: email,
              password: password,
            },
          },
          {
            headers: {
              Accept: "application/json",
              "X-CSRF-Token": csrfToken,
            },
          }
        )
        .then((response) => {
          console.log("Login successful:", response);
          // Handle success
        })
        .catch((error) => {
          console.log("Login failed:", error);
          // Handle error
        });
    } else {
      console.log("CSRF token not found");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="text"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
