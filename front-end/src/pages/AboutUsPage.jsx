import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo/SukiWhite.svg";
import "../assets/AboutUsPage.css";
import TeamImage from "../assets/About Us.jpg";

import Ring1 from "../assets/Abstract Objects/Ellipse 9.svg";
import Polygon1 from "../assets/Abstract Objects/Polygon 1-1.svg";
import Ellipse1 from "../assets/Abstract Objects/Ellipse 8.svg";

// AbstractFigures component
function AbstractFigures() {
  return (
    <div className="about-us__abstract-container">
      <div className="about-us__top-right-gradient"></div>
      <div className="about-us__middle-gradient"></div>
      <div className="about-us__bottom-right-gradient"></div>

      <img src={Ring1} className="about-us__ring-1"></img>
      <img src={Polygon1} className="about-us__polygon-1"></img>
      <img src={Ellipse1} className="about-us__ellipse-1"></img>
    </div>
  );
}

// AboutUs component
function AboutUsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-us__container" action="/aboutus">
      <AbstractFigures />
      <header className="new-guest-page__header">
        <div className="new-guest-page__header-gradient-after-logo" />

        <div className="new-guest-page__header-left-section">
          <img src={logo} className="new-guest-page__header-suki-logo" />
          <p className="new-guest-page__header-website-title">SUKI</p>
        </div>
        <div className="new-guest-page__header-right-section">
          <ul className="new-guest-page__header-navigation-bar">
            <Link
              to="/guestsearch"
              className="new-guest-page__header-navigation-bar-button"
            >
              SEARCH
            </Link>
            <Link
              to="/"
              className="new-guest-page__header-navigation-bar-button"
            >
              HOME
            </Link>
            <Link className="new-guest-page__header-navigation-bar-button-here">
              ABOUT
            </Link>
            <Link
              to="/login"
              className="new-guest-page__header-navigation-bar-button"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="new-guest-page__header-navigation-bar-button"
            >
              SIGN UP
            </Link>
          </ul>
        </div>
      </header>

      <div className="about-us__card-container">
        <div className="about-us__card">
          <p className="title">About Us</p>
          <div className="about-us__story-container">
            <div className="about-us__logo-container">
              <img src={logo} alt="Logo" />
            </div>
            <div className="about-us__story-text">
              <span>The Story</span>
              <p className="p-1">
                <strong>Suki Event Management Platform</strong> was created out
                of a passion for creating unforgettable experiences and
                simplifying the event planning process. We believe everyone
                should have access to events, regardless of their planning
                experience.
              </p>
              <p className="p-2">
                We handmade <strong>Suki</strong>, a user-friendly{" "}
                <strong>event management platform </strong>
                designed with you in mind. Whether you're an event organizer
                bringing your vision to life, or an attendee seeking incredible
                experiences, <strong>Suki</strong> always empowers you.
              </p>
            </div>
          </div>
          <div className="about-us__team-container">
            <div className="about-us__team-text">
              <span>The Team</span>
              <p className="p-1">
                We are <strong>EVE</strong>, the fifth group in our university
                class, <strong>22CLC08</strong>. This is a project created by us
                for our Course of{" "}
                <strong>Introduction to Software Engineering. </strong>
                Throughout this project, we have learned a lot of new concepts
                and ideas, and we are confident to bring this event management
                platform to life.
              </p>
              <p className="p-2">
                Our team consists of <strong>five</strong> people: Lâm Tiến Huy,
                Lê Thành Lợi, Trịnh Quốc Hiệp, Nguyễn Trọng Nhân, and Kha Vĩnh
                Thuận. Each person in our team is very committed to this
                project, to perfect this product for all of you.
              </p>
            </div>
            <img
              src={TeamImage}
              alt="Team"
              className="about-us__team-img-container"
            />
          </div>
        </div>
      </div>

      <footer className="new-guest-page__footer">
        <div className="new-guest-page__footer-main-content">
          <div className="new-guest-page__footer-left-section">
            <div className="new-guest-page__footer-text-container">
              <div className="new-guest-page__footer-text-container-title">
                Contact Us
              </div>
              <div className="new-guest-page__footer-text-container-description">
                VNU-HCM University Of Science, 227 Nguyễn Văn Cừ St., Ward 4,
                District 5, Ho Chi Minh City, Vietnam.
              </div>
            </div>
            <div className="new-guest-page__footer-text-container">
              <div className="new-guest-page__footer-text-container-title">
                Hotline
              </div>
              <div className="new-guest-page__footer-text-container-description">
                0908.741.901 - Mr. Lợi
              </div>
            </div>
            <div className="new-guest-page__footer-branding">
              <img src={logo} className="new-guest-page__footer-suki-logo" />
              <p className="new-guest-page__footer-website-title">SUKI</p>
            </div>
          </div>
          <div className="new-guest-page__footer-right-section">
            <div className="new-guest-page__footer-text-container-title-version-2">
              Subscribe For New Updates!
            </div>
            <div className="new-guest-page__footer-text-container-button-container">
              <input
                className="new-guest-page__footer-text-container-email"
                placeholder="Email Address"
                type="email"
              />
              <button className="new-guest-page__footer-link-button" href="#">
                SUBSCRIBE
              </button>
            </div>
            <div className="new-guest-page__footer-text-container-description-version-2">
              <p>Suki Inc. © 2024 All Rights Reserved</p>
              <p>Introduction to Software Engineering</p>
              <p>22CLC08 - Group 5</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutUsPage;
