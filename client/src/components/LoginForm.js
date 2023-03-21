import { useState, useEffect } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import BankTransactions from "./BankTransactions";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [linkToken, setLinkToken] = useState("");
  const [user, setUser] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      // send the public_token back to the backend to exchange for an access_token
      axios
        .post(
          "http://localhost:3001/api/v1/plaid/create_client_token",
          {
            public_token: public_token,
            user: user,
          },
          {
            headers: {
              Accept: "application/json",
              "X-CSRF-Token": csrfToken,
            },
          }
        )
        .then((response) => {
          console.log(response);
          setAccessToken(response.data.client_token);
        })
        .catch((error) => {
          console.log("Error exchanging token:", error);
        });
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
          setUser(response.data.user_id);
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
    <>
      {accessToken ? (
        <BankTransactions accessToken={accessToken} />
      ) : (
        <form class="vh-100 gradient-custom" onSubmit={handleSubmit}>
          <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
              <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div
                  onSubmit={handleSubmit}
                  class="card bg-dark text-white"
                  style={{ borderRadius: "1rem" }}
                >
                  <i
                    class="bi bi-piggy-bank"
                    style={{
                      position: "absolute",
                      top: "-3px",
                      left: "9px",
                      fontSize: "3.5rem",
                    }}
                  ></i>
                  <div class="card-body p-5 text-center">
                    <div class="mb-md-5 mt-md-4 pb-5">
                      <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                      <p class="text-white-50 mb-5">
                        Please enter your login and password!
                      </p>

                      <div class="form-outline form-white mb-4">
                        <input
                          type="text"
                          value={email}
                          class="form-control form-control-lg"
                          onChange={(event) => setEmail(event.target.value)}
                        />
                        <label class="form-label" for="typeEmailX">
                          Email
                        </label>
                      </div>

                      <div class="form-outline form-white mb-4">
                        <input
                          type="password"
                          value={password}
                          class="form-control form-control-lg"
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        <label class="form-label" for="typePasswordX">
                          Password
                        </label>
                      </div>

                      <p class="small mb-5 pb-lg-2">
                        <a class="text-white-50" href="#!">
                          Forgot password?
                        </a>
                      </p>

                      <button
                        class="btn btn-outline-light btn-lg px-5"
                        type="submit"
                      >
                        Login
                      </button>
                      <button
                        class="btn btn-outline-light btn-lg px-5"
                        type="button"
                        onClick={handleLinkClick}
                        disabled={!ready || !linkToken}
                        target="_blank"
                      >
                        Connect your Bank Account
                      </button>
                      <div class="d-flex justify-content-center text-center mt-4 pt-1">
                        <a href="#!" class="text-white">
                          <i class="fab fa-facebook-f fa-lg"></i>
                        </a>
                        <a href="#!" class="text-white">
                          <i class="fab fa-twitter fa-lg mx-4 px-2"></i>
                        </a>
                        <a href="#!" class="text-white">
                          <i class="fab fa-google fa-lg"></i>
                        </a>
                      </div>
                    </div>

                    <div>
                      <p class="mb-0">
                        Don't have an account?{" "}
                        <a href="#!" class="text-white-50 fw-bold">
                          Sign Up
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default LoginForm;
