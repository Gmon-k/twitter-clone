// Login.jsx

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import "./Login.css";

export default function Login() {
  const [loginFormState, setLoginFormState] = useState({});
  const [errorDetailsState, setErrorDetailsState] = useState("");
  const navigate = useNavigate();

  function updateUserNameInState(event) {
    const username = event.target.value;

    const newLoginFormState = {
      password: loginFormState.password,
      username: username,
    };

    setLoginFormState(newLoginFormState);
  }

  function updatePasswordInState(event) {
    const password = event.target.value;

    const newLoginFormState = {
      username: loginFormState.username,
      password: password,
    };

    setLoginFormState(newLoginFormState);
  }

  async function submitLogin() {
    try {
      const response = await axios.post('/api/user/login',loginFormState)
      const username = response.data.username;
      navigate(`/home/${username}`);
    } catch (err) {
      setErrorDetailsState("Issue logging in, please try again :)");
    }
  }

  function goToSignUp() {
    navigate("/signup");
  }

  let errorMessage = null;
  if (errorDetailsState) {
    errorMessage = <div>{errorDetailsState}</div>;
  }

  return (
    <div className="login-container">
      <div className="left-side-login">
        {/* Add background image styling here */}
      </div>
      <div className="right-side-login">
        <div className="logo-container-login">
          {/* Add your logo image */}
        </div>
        <div className="form-container">
          <div className="username-label">Username:</div>
          <input
            type="text"
            className="input-field"
            onInput={updateUserNameInState}
          />
          <div className="password-label">Password:</div>
          <input
            type="password"
            className="input-field"
            onInput={updatePasswordInState}
          />
          <div className="button-container">
            <button className="login-button" onClick={submitLogin}>
              Log in
            </button>
            <button className="create-account-button" onClick={goToSignUp}>
              Create a new account
            </button>
          </div>
          {errorMessage}
        </div>
      </div>
    </div>
  );
}
