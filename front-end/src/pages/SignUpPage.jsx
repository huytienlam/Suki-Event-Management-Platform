import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import whiteLogo from "../assets/Logo/SukiWhite.svg";
import "../assets/SignUpPage.css";
import { sendSignupRequest } from "../API";

import Ring1 from "../assets/Abstract Objects/Ellipse 9-3.svg";
import Ellipse1 from "../assets/Abstract Objects/Ellipse 8-4.svg";
import Ellipse2 from "../assets/Abstract Objects/Ellipse 8-2.svg";
import Polyline1 from "../assets/Abstract Objects/Vector 8-3.svg";
import Polyline2 from "../assets/Abstract Objects/Vector 8-1.svg";

function AbstractFigures() {
  return (
    <>
      <div className="sign-up__abstract-container">
        <div className="sign-up__top-left-gradient"></div>
        <div className="sign-up__bottom-right-gradient"></div>

        <div className="sign-up__abstract-triangle">
          <div className="sign-up__edge1" />
          <div className="sign-up__edge2" />
          <div className="sign-up__edge3" />
        </div>

        <img src={Ring1} className="sign-up__ring-1"></img>
        <img src={Polyline1} className="sign-up__polyline-1"></img>
        <img src={Ellipse1} className="sign-up__ellipse-1"></img>
        <img src={Polyline2} className="sign-up__polyline-2"></img>
        <img src={Ellipse2} className="sign-up__ellipse-2"></img>
      </div>
    </>
  );
}

const ErrorModal = ({ message, onClose }) => (
  <div className="sign-up__modal-overlay">
    <div className="sign-up__modal-content">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

function SignUpForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const closeErrorModal = () => setError("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!(form instanceof HTMLFormElement)) {
      console.error("Form is not an instance of HTMLFormElement");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());
    if (isChecked) {
    const response = await sendSignupRequest(formDataObj);

    if (response.success) {
      navigate("/login");
    } else {
      setError(response.message || "Sign up failed. Please try again.");
    }
  }
  else{
    setError("Please agree to the terms and conditions.");
  }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(true);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(true);
  };

  return (
    <div className="sign-up__form-container">
      <AbstractFigures />
      <Link to="/" className="login-signup__back-to-guest">
        <span>&#8249;</span>&#8194; BACK
      </Link>
      <form
        className="sign-up__form"
        onSubmit={handleSubmit}
        action="/sign-up"
        method="POST"
      >
        <div className="logo-container">
          <img src={whiteLogo} alt="logo" />
        </div>
        <input
          type="text"
          className="sign-up__username"
          placeholder="Username"
          name="username"
          required
        />
        <input
          type="email"
          className="sign-up__email"
          placeholder="Email"
          name="email"
          required
        />
        <input
          id="password"
          name="password"
          className="sign-up__password"
          placeholder="Password"
          type="password"
          onChange={handlePasswordChange}
          required
        />
        <input
          id="confirmPassword"
          name="confirmPassword"
          className="sign-up__password"
          placeholder="Confirm Password"
          type="password"
          onChange={handleConfirmPasswordChange}
          required
        />
        {!passwordMatch && (
          <p className="sign-up__error-text">Passwords do not match!</p>
        )}
        <div className="signup-page__remember-me-container">
          <label htmlFor="signup-page__remember-me-part">
            <svg
              className={`signup-page__checkbox ${
                isChecked ? "signup-page__checked--active" : ""
              }`}
              aria-hidden="true"
              viewBox="0 0 15 11"
              fill="none"
            >
              <path
                d="M1 4.5L5 9L14 1"
                strokeWidth="2"
                stroke={isChecked ? "#fff" : "none"}
              />
            </svg>
            <input
              type="checkbox"
              id="signup-page__remember-me-part"
              name="signup-page__remember-me-part"
              onChange={() => setIsChecked(!isChecked)}
              checked={isChecked}
            />
          </label>
          <p>
            I agree with the Terms and Conditions of the Suki Event Management
            Platform and responsible for the information provided in this form.
          </p>
        </div>
        <button className="sign-up__button" type="submit" name="submit">
          Sign Up
        </button>
        <div className="sign-up__already-have-account-container">
          Already have an account?{" "}
          <Link to="/login" className="sign-up__login-now">
            <strong>Log In Now!</strong>
          </Link>
        </div>
      </form>
      {error && <ErrorModal message={error} onClose={closeErrorModal} />}
    </div>
  );
}

export default SignUpForm;
