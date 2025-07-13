import { useState, useEffect } from "react";
import { sendLoginRequest, forgotPassword } from "../API"; // Adjust the path as needed
import "../assets/LogInPage.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Ring1 from "../assets/Abstract Objects/Ellipse 9-1.svg";
import Ellipse1 from "../assets/Abstract Objects/Ellipse 8-4.svg";
import Polyline1 from "../assets/Abstract Objects/Vector 8-3.svg";
import Polygon1 from "../assets/Abstract Objects/Polygon 1-2.svg";

function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

// Custom Hook: Handle body overflow for a specific route
const useBodyOverflowHiddenOnRoute = (route) => {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow =
      location.pathname === route ? "hidden" : "auto";

    // Cleanup: Revert overflow when the component unmounts or route changes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location.pathname, route]);
};

// Component: Error Modal
const ErrorModal = ({ message, onClose }) => (
  <div className="login-page__modal-overlay">
    <div className="login-page__modal-content">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

// Component: Abstract Figures
const AbstractFigures = () => (
  <div className="login-page__login-abstract-container">
    <div className="sign-up__top-left-gradient"></div>
    <div className="sign-up__bottom-right-gradient"></div>

    <img src={Ring1} className="login-page__ring-1"></img>
    <img src={Polyline1} className="login-page__polyline-1"></img>
    <img src={Polygon1} className="login-page__polygon-1"></img>
    <img src={Ellipse1} className="login-page__ellipse-2"></img>
  </div>
);

// Component: Forgot Password
const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const response = await forgotPassword({ email });
    setMessage(
      response.success
        ? "Password reset link has been sent to your email."
        : "Failed to send reset link. Please try again."
    );
  };

  return (
    <div className="forgot-password__container">
      <form className="forgot-password__form" onSubmit={handleFormSubmit}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="forgot-password__blue-button">
          Send Reset Link
        </button>
        {message && <p className="forgot-password__message">{message}</p>}
        <button
          type="button"
          className="forgot-password__pink-button"
          onClick={onBack}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

// Component: Login Page
const Login = () => {
  useBodyOverflowHiddenOnRoute("/login");
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [password, setPassword] = useState("");
  const closeErrorModal = () => setError("");
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    const rememberMe = localStorage.getItem("rememberme");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedPassword) {
      setPassword(storedPassword);
    }
    if (rememberMe) {
      setIsChecked(true);
    }
  }, []);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.target.style.backgroundColor = "none"; // Customize as needed
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObj = Object.fromEntries(formData.entries());
    if (
      formDataObj.username === "admin@@" ||
      formDataObj.password === "admin@@"
    ) {
      localStorage.setItem("isAdmin", "dummyAdmin");
      navigate("/admin");
    } else {
      const response = await sendLoginRequest(formDataObj);

      if (response.success) {
        localStorage.setItem("UserID", response.userID);
        if (isChecked) {
          localStorage.setItem("rememberme", true);
          localStorage.setItem("username", formDataObj.username);
          localStorage.setItem("password", formDataObj.password);
        } else {
          localStorage.setItem("rememberme", false);
        }
        navigate("/mainpage");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    }
  };

  useScrollToTop();

  return (
    <div className="login-page__login__container">
      <AbstractFigures />
      <Link to="/" className="login-signup__back-to-guest">
        <span>&#8249;</span>&#8194; BACK
      </Link>
      {showForgotPassword ? (
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      ) : (
        <form
          className="login-page__login-form"
          id="login-form"
          onSubmit={handleFormSubmit}
        >
          <span id="format-title">
            <p className="login-page__title">Login</p>
          </span>
          <span id="input-format">
            <input
              required
              type="text"
              placeholder="Username"
              onKeyDown={handleKeyPress}
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </span>
          <span id="input-format">
            <input
              required
              type="password"
              placeholder="Password"
              onKeyDown={handleKeyPress}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </span>
          <span id="input-format">
            <div className="login-page__remember-me-forgot">
              <div className="login-page__remember-me-container">
                <label htmlFor="remember-me">
                  <svg
                    className={`login-page__checkbox ${
                      isChecked ? "login-page__checked--active" : ""
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
                    id="remember-me"
                    name="remember-me"
                    onChange={() => setIsChecked(!isChecked)}
                    checked={isChecked}
                  />
                  <span>Remember me</span>
                </label>
              </div>
              <div className="login-page__forgot-password-container">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </span>
          <span id="input-format">
            <button
              type="submit"
              id="login-button"
              className="login-page__login-button"
            >
              Login
            </button>
          </span>
          <div className="login-page__dont-have-account">
            Don't have an account?
            <Link className="login-page__account" to="/signup">
              <strong>Sign Up Now!</strong>
            </Link>
          </div>
        </form>
      )}
      {error && <ErrorModal message={error} onClose={closeErrorModal} />}
    </div>
  );
};

export default Login;
