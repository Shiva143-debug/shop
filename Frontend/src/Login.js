import React, { useState } from 'react';
import Cookies from 'js-cookie';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
// import axios from 'axios';

import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  //   const history = useHistory();
  const navigate = useNavigate();

  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    });
    navigate("/home")
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  };


  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password };
    const url = 'http://localhost:8083/validate-login';
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();
        if ('message' in data && 'jwt_token' in data) {
          onSubmitSuccess(data.jwt_token);
        } else {
          console.error('Invalid response structure:', data);
          onSubmitFailure('Invalid response from the server');
        }
      } else {
        const errorData = await response.json();
        onSubmitFailure(errorData.error_msg);
      }
    } catch (error) {
      console.error('Error during login:', error);
      onSubmitFailure('An error occurred during login.');
    }
  };


  const renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="password-input-field"
        value={password}
        onChange={onChangePassword}
        placeholder="Password"
      />
    </>
  );

  const renderUsernameField = () => (
    <>
      <label className="input-label" htmlFor="username">
        USERNAME
      </label>
      <input
        type="text"
        id="username"
        className="username-input-field"
        value={username}
        onChange={onChangeUsername}
        placeholder="Username"
      />
    </>
  );

  const onRegisterClick = () => {

  }

  return (
    <div className="login-form-container">

      <img
        src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1675667166/Layer_2_zpnk6t.jpg"
        className="login-img"
        alt="website login"
      />

      <div className='d-flex flex-column'>
        <div className='d-flex'>
          <button onClick={onRegisterClick} style={{ backgroundColor: "white", border: "1px solid whitesmoke", width: "50%", padding: "5px" }}>Register</button>
          <button style={{ backgroundColor: "white", border: "1px solid whitesmoke", width: "50%", padding: "5px" }}>Login</button>
        </div>
        <form className="form-container" onSubmit={submitForm}>


          {/* <img
            src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1675668478/Standard_Collection_8_lbjbou.svg"
            className="login-website-logo-desktop-img"
            alt="website logo"
          /> */}
          <h1 className="app-name">APP NAME</h1>
          <div className="input-container">{renderUsernameField()}</div>
          <div className="input-container">{renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
