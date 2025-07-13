import { useState, useEffect } from "react";
import "../assets/ErrorPage.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Ring1 from '../assets/Abstract Objects/Ellipse 9-2.svg';
import Ellipse1 from '../assets/Abstract Objects/Ellipse 8-2.svg';
import Polyline1 from '../assets/Abstract Objects/Vector 8-2.svg';
import Polygon1 from '../assets/Abstract Objects/Polygon 1-2.svg';

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
    document.body.style.overflow = location.pathname === route ? "hidden" : "auto";

    // Cleanup: Revert overflow when the component unmounts or route changes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location.pathname, route]);
};

// Component: Abstract Figures
const AbstractFigures = () => (
  <div className="error-page__login-abstract-container">
    <div className="error-page__top-left-gradient"></div>
    <div className="error-page__bottom-right-gradient"></div>

    <img src={Ring1} className="error-page__ring-1"></img>
    <img src={Polyline1} className="error-page__polyline-1"></img>
    <img src={Polygon1} className="error-page__polygon-1"></img>
    <img src={Ellipse1} className="error-page__ellipse-2"></img>

  </div>
);

// Component: Login Page
const ErrorPage = () => {
  useBodyOverflowHiddenOnRoute("/error");
  useScrollToTop();

  return (
    <div className="error-page__login__container">
      <AbstractFigures />
    
      <div className="error-page__login-form">
        <div className="error-page__title">Oops!</div>
        <div className="error-page__error-type">404 - PAGE NOT FOUND!</div>
        <div className="error-page__description">
          The page you were looking for may have been moved or deleted.
        </div>
      </div>

    </div>
  );
};

export default ErrorPage;