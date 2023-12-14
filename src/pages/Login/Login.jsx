import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import "./Login.css";
import twitterLogo from '../../Images/logo.png'
import bg from '../../Images/bg.png'
//pages for the Login
export default function Login() {
  const [loginFormState, setLoginFormState] = useState({});  //login form state
  const [errorDetailsState, setErrorDetailsState] = useState(""); //error detail state
  const navigate = useNavigate();
  //function to update the username
  function updateUserNameInState(event) {
    const username = event.target.value;
    const newLoginFormState = {
      password: loginFormState.password,
      username: username,
    };
    setLoginFormState(newLoginFormState);
  }
  //function to update the password
  function updatePasswordInState(event) {
    const password = event.target.value;
    const newLoginFormState = {
      username: loginFormState.username,
      password: password,
    };
    setLoginFormState(newLoginFormState);
  }
  //function for submit login
  async function submitLogin() {
    try {
      const response = await axios.post('/api/user/login', loginFormState)
      const username = response.data.username;
      navigate(`/home/${username}`);
    } catch (err) {
      setErrorDetailsState("Issue logging in, please try again :)");
    }
  }
  //function to go to signup page
  function goToSignUp() {
    navigate("/signup");
  }
  //for displaying the error message
  let errorMessage = null;
  if (errorDetailsState) {
    errorMessage = <div>{errorDetailsState}</div>;
  }
 //HTML side of the page
  return (
    <div className="login-container">
      <img src={bg} alt="bg" className="left-side" />
      <div className="right-side">
        <img src={twitterLogo} alt="Logo" className="logo-container" />

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
