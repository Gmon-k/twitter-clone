import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import './Signup.css'
import twitterLogo from '../../Images/logo.png'
import bg from '../../Images/bg.png'


export default function Signup() {
    const [signupFormState, setSignupFormState] = useState({});
    const [errorDetailsState, setErrorDetailsState] = useState('');
    const navigate = useNavigate();

    function updateFirstNameInState(event) {
        const firstName = event.target.value;

        const newSignupFormState = {
            ...signupFormState,
            firstName: firstName,
        };

        setSignupFormState(newSignupFormState);
    }

    function updateLastNameInState(event) {
        const lastName = event.target.value;

        const newSignupFormState = {
            ...signupFormState,
            lastName: lastName,
        };

        setSignupFormState(newSignupFormState);
    }

    function updateUserNameInState(event) {
        const username = event.target.value;

        const newSignupFormState = {
            ...signupFormState,
            username: username,
        };

        setSignupFormState(newSignupFormState);
    }

    function updatePasswordInState(event) {
        const password = event.target.value;

        const newSignupFormState = {
            ...signupFormState,
            password: password,
        };

        setSignupFormState(newSignupFormState);
    }

    async function submitSignup() {
        try {
            const response = await axios.post('/api/user/signup', signupFormState);
            const { username } = response.data;
            navigate(`/profile/${username}`);
        } catch (err) {
            setErrorDetailsState("Issue signing up, please try again :)");
        }
    }

    let errorMessage = null;
    if (errorDetailsState) {
        errorMessage = <div>{errorDetailsState}</div>;
    }

    return (
        <div className="signup-container">
        <img src={bg} alt="bg" className="left-side" />
        <div className="right-side">
            <img src={twitterLogo} alt="Logo" className="logo-container" />
            <div className="form-container">
                <div className="label">First Name:</div>
                <input type='text' className="input-field" onInput={updateFirstNameInState} />
                <div className="label">Last Name:</div>
                <input type='text' className="input-field" onInput={updateLastNameInState} />
                <div className="label">User Name:</div>
                <input type='text' className="input-field" onInput={updateUserNameInState} />
                <div className="label">Password:</div>
                <input type='password' className="input-field" onInput={updatePasswordInState} />
                
                <div className="button-container">
                    <button className="signup-button" onClick={submitSignup}>Sign Up</button>
                </div>
                <div className="error-message">{errorMessage}</div>
            </div>
        </div>
    </div>
    );
}
