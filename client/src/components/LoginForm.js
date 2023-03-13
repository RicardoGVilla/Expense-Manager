import { useState, useEffect } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [linkToken, setLinkToken] = useState("");
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      console.log("You made it");
      console.log("public_token:", public_token);
      console.log("metadata:", metadata);
      // send the public_token back to the backend to exchange for an access_token
    },
    onExit: (err, metadata) => {
      console.log("onExit:", err, metadata);
    },
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/v1/csrf_token")
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLinkClick = () => {
    console.log(ready);
    console.log(linkToken);
    if (ready && linkToken) {
      open();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (csrfToken) {
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
          setLinkToken(response.data.link_token);
        })
        .catch((error) => {
          console.log("Login failed:", error);
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
      <button
        type="button"
        onClick={handleLinkClick}
        disabled={!ready || !linkToken}
        target="_blank"
      >
        Connect a bank account
      </button>
    </form>
  );
};

export default LoginForm;
