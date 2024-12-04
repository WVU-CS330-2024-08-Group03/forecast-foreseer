import React, { useState } from 'react';
import './SignInStyles.css';
import { Link } from 'react-router-dom';

function SignIn() {
    const [passwordType, setPasswordType] = useState('password');

    const togglePassword = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    };

    return (
        <form id="signInForm">
            <div id="container">
                <div id="heading">Sign In</div>
                <div>
                    <label htmlFor="username" id="usernameLabel">Username:</label>
                    <input type="text" name="username" id="username" required autoComplete="on" />
                </div>
                <div>
                    <label htmlFor="password" id="passwordLabel">Password:</label>
                    <input type={passwordType} name="password" id="password" />
                </div>
                <div>
                    <label htmlFor="showPass" id="showPassLabel">Show Password:</label>
                    <input type="checkbox" name="showPass" id="showPass" onChange={togglePassword} />
                </div>
                <div>
                    <input type="submit" id="submitButton" />
                </div>
                <div id="forgotUsername">
                    <Link to="/forgot-username">Forgot Username</Link>
                </div>
                <div id="forgotPassword">
                    <Link to="/forgot-password">Forgot Password</Link>
                </div>
                <div id="createAccount">
                    <span>New user?</span>
                    <Link to="/create-account" id="createAccountLink">Create Account</Link>
                </div>
            </div>
        </form>
    );
}

export default SignIn;