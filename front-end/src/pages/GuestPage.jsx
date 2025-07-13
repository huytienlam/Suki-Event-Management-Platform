import React, { useEffect } from "react";
import "../assets/GuestPage.css";

import whiteLogo from "../assets/Logo/SukiWhite.svg";
import colorLogo from "../assets/Logo/SukiColor.svg";

import Organizers from "../assets/Guests/Organizers.svg";
import Participants from "../assets/Guests/Participants.svg";
import Guests from "../assets/Guests/Guests.svg";
import Multitasking from "../assets/Guests/Multitasking.svg";
import Secured from "../assets/Guests/Secured.svg";

import Music from "../assets/Categories/Music.svg";
import Charity from "../assets/Categories/Charity.svg";
import Teambuilding from "../assets/Categories/Teambuilding.svg";
import Festival from "../assets/Categories/Festival.svg";
import Meeting from "../assets/Categories/Meeting.svg";

import Ring1 from "../assets/Abstract Objects/Ellipse 9-1.svg";
import Polygon1 from "../assets/Abstract Objects/Polygon 1.svg";
import Polygon2 from "../assets/Abstract Objects/Polygon 1-2.svg";
import Polygon3 from "../assets/Abstract Objects/Polygon 1-3.svg";
import Ellipse1 from "../assets/Abstract Objects/Ellipse 8-4.svg";
import Ellipse2 from "../assets/Abstract Objects/Ellipse 7-1.svg";
import Ellipse3 from "../assets/Abstract Objects/Ellipse 7.svg";
import Ellipse4 from "../assets/Abstract Objects/Ellipse 8-2.svg";
import Polyline1 from "../assets/Abstract Objects/Vector 8.svg";
import Polyline2 from "../assets/Abstract Objects/Vector 8-1.svg";

import { Link } from "react-router-dom";

const buttons = document.querySelectorAll("[data-carousel-button]");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1;
    const slides = button
      .closest("[data-carousel]")
      .querySelector("[data-slides]");

    const activeSlide = slides.querySelector("[data-active]");
    let newIndex = [...slides.children].indexOf(activeSlide) + offset;
    if (newIndex < 0) newIndex = slides.children.length - 1;
    if (newIndex >= slides.children.length) newIndex = 0;

    slides.children[newIndex].dataset.active = true;
    delete activeSlide.dataset.active;
  });
});

function NewGuestPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="new-guest-page__full">
      <header className="new-guest-page__header">
        <div className="new-guest-page__header-gradient-after-logo" />

        <div className="new-guest-page__header-left-section">
          <img src={whiteLogo} className="new-guest-page__header-suki-logo" />
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
            <Link className="new-guest-page__header-navigation-bar-button-here">
              HOME
            </Link>
            <Link
              to="/aboutus"
              className="new-guest-page__header-navigation-bar-button"
            >
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

      <main>
        <div className="new-guest-page__first-section">
          <div className="new-guest-page__first-section-top-right-gradient" />
          <img
            src={Polygon1}
            className="new-guest-page__first-section-polygon-1"
          />
          <img
            src={Polygon2}
            className="new-guest-page__first-section-polygon-2"
          />
          <img
            src={Ellipse1}
            className="new-guest-page__first-section-ellipse-2"
          />
          <img
            src={Ellipse2}
            className="new-guest-page__first-section-ellipse-1"
          />
          <img
            src={Ellipse3}
            className="new-guest-page__first-section-ellipse-3"
          />
          <img
            src={Polyline1}
            className="new-guest-page__first-section-polyline-1"
          />

          <div className="new-guest-page__first-section-main-content">
            <div className="new-guest-page__first-section-main-text">
              <div className="new-guest-page__first-section-main-text-suki">
                SUKI
              </div>
              <div className="new-guest-page__first-section-main-text-description">
                The Ultimate Event Creation and Promotion Hub.
              </div>
              <div className="new-guest-page__first-section-main-text-button-container">
                <Link to="/signup">
                  <button
                    className="new-guest-page__first-section-main-text-link-button"
                    href="#"
                    style={{ marginRight: "20px" }}
                  >
                    SIGN UP NOW
                  </button>
                </Link>
                <Link to="/aboutus">
                  <button
                    className="new-guest-page__first-section-main-text-link-button"
                    href="#"
                  >
                    ABOUT US
                  </button>
                </Link>
              </div>
              <div className="new-guest-page__first-section-free-text">
                This platform is completely <strong>FREE</strong>.
              </div>
            </div>
            <div className="new-guest-page__first-section-main-figure">
              <img src={whiteLogo} />
            </div>
          </div>
        </div>

        <div className="new-guest-page__second-section">
          <div className="new-guest-page__second-section-top-left-gradient" />
          <div className="new-guest-page__second-section-middle-gradient" />

          <div className="new-guest-page__second-section-title">
            <div className="new-guest-page__second-section-title-main">
              Effortless event planning,
            </div>
            <div className="new-guest-page__second-section-title-main">
              from start to finish.
            </div>
            <div className="new-guest-page__second-section-title-description">
              We are a go to platform for all organizers and participants out
              there.
            </div>
          </div>
          <div className="new-guest-page__second-section-main-advertisements">
            <div className="new-guest-page__second-section-main-advertisements-part">
              <div className="new-guest-page__second-section-main-advertisements-image">
                <img src={Organizers} />
              </div>
              <div className="new-guest-page__second-section-main-advertisements-content">
                <div className="new-guest-page__second-section-main-advertisements-content-aim">
                  For Organizers...
                </div>
                <div className="new-guest-page__second-section-main-advertisements-content-description">
                  We empower organizers to effortlessly plan and advertise your
                  events. Our intuitive platform streamlines the entire process,
                  from conceptualization to completion. With robust tools for
                  creating captivating event pages, managing ticket sales, and
                  engaging with attendees, organizers can focus on crafting
                  memorable experiences.
                </div>
              </div>
            </div>
            <div className="new-guest-page__second-section-main-advertisements-part">
              <div className="new-guest-page__second-section-main-advertisements-content">
                <div className="new-guest-page__second-section-main-advertisements-content-aim">
                  For Participants...
                </div>
                <div className="new-guest-page__second-section-main-advertisements-content-description">
                  Our platform is designed for you to find and explore events
                  tailored to your interests, purchase tickets seamlessly, and
                  stay informed with fast updates. Our user-friendly interface
                  ensures a smooth experience from discovery to attendance.
                  Connect with fellow attendees, share your enthusiasm, and have
                  fun.
                </div>
              </div>
              <div className="new-guest-page__second-section-main-advertisements-image">
                <img src={Participants} />
              </div>
            </div>
            <div className="new-guest-page__second-section-main-advertisements-part">
              <div className="new-guest-page__second-section-main-advertisements-image">
                <img src={Guests} />
              </div>
              <div className="new-guest-page__second-section-main-advertisements-content">
                <div className="new-guest-page__second-section-main-advertisements-content-aim">
                  For Guests...
                </div>
                <div className="new-guest-page__second-section-main-advertisements-content-description">
                  New to Suki? Let us be your event guide! Our dedicated team is
                  ready to show you the ropes. From searching for events to
                  navigating our platform, we're here to assist you every step
                  of the way. Experience the difference and unlock endless
                  possibilities. Impressed? Sign up now!
                </div>
              </div>
            </div>
          </div>
          <div className="new-guest-page__second-section-bottom-left-gradient" />
        </div>

        <div className="new-guest-page__third-section">
          <div className="new-guest-page__third-section-title">
            Discover. Attend. Connect.
          </div>
          <div className="new-guest-page__third-section-main-content">
            <div className="new-guest-page__third-section-main-content-part">
              <div className="new-guest-page__third-section-main-content-part-image">
                <img src={Multitasking} />
              </div>
              <div className="new-guest-page__third-section-main-content-part-text">
                <div className="new-guest-page__third-section-main-content-part-title-left">
                  Full-on Flexibility
                </div>
                <div className="new-guest-page__third-section-main-content-part-description">
                  Your vision, your rules, with unparalleled flexibility for
                  organizers and participants. Customize your events, manage
                  people effortlessly, and enjoy personalized experiences. Our
                  platform adapts to your needs, ensuring seamless usage.
                </div>
              </div>
            </div>
            <div className="new-guest-page__third-section-main-content-part">
              <div className="new-guest-page__third-section-main-content-part-image">
                <img src={Secured} />
              </div>
              <div className="new-guest-page__third-section-main-content-part-text">
                <div className="new-guest-page__third-section-main-content-part-title-right">
                  Simplified and Secured
                </div>
                <div className="new-guest-page__third-section-main-content-part-description">
                  Experience the ease of event management and attendance. Our
                  intuitive interface and robust security measures provide a
                  smooth experience. Focus on creating amazing journeys and
                  experiences while we handle the details.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="new-guest-page__fourth-section">
          <img src={Ring1} className="new-guest-page__fourth-section-ring-1" />
          <img
            src={Polyline2}
            className="new-guest-page__fourth-section-polyline-2"
          />
          <img
            src={Ellipse2}
            className="new-guest-page__fourth-section-ellipse-4"
          />
          <img
            src={Ellipse4}
            className="new-guest-page__fourth-section-ellipse-5"
          />

          <div className="new-guest-page__fourth-section-title">
            Multicategory Support
          </div>
          <div className="new-guest-page__fourth-section-main-content">
            <div className="new-guest-page__fourth-section-category">
              <div className="new-guest-page__fourth-section-category-image">
                <img src={Music} />
              </div>
              <div className="new-guest-page__fourth-section-category-name">
                Music
              </div>
            </div>
            <div className="new-guest-page__fourth-section-category">
              <div className="new-guest-page__fourth-section-category-image">
                <img src={Charity} />
              </div>
              <div className="new-guest-page__fourth-section-category-name">
                Charity
              </div>
            </div>
            <div className="new-guest-page__fourth-section-category">
              <div className="new-guest-page__fourth-section-category-image">
                <img src={Teambuilding} />
              </div>
              <div className="new-guest-page__fourth-section-category-name">
                Teambuilding
              </div>
            </div>
            <div className="new-guest-page__fourth-section-category">
              <div className="new-guest-page__fourth-section-category-image">
                <img src={Festival} />
              </div>
              <div className="new-guest-page__fourth-section-category-name">
                Festival
              </div>
            </div>
            <div className="new-guest-page__fourth-section-category">
              <div className="new-guest-page__fourth-section-category-image">
                <img src={Meeting} />
              </div>
              <div className="new-guest-page__fourth-section-category-name">
                Meeting
              </div>
            </div>
          </div>
        </div>

        <div className="new-guest-page__fifth-section">
          <div className="new-guest-page__fifth-section-main-content">
            <div className="new-guest-page__fifth-section-logo">
              <img src={colorLogo} />
            </div>
            <div className="new-guest-page__fifth-section-main-text">
              <div className="new-guest-page__fifth-section-main-text-name">
                SUKI
              </div>
              <div className="new-guest-page__fifth-section-main-text-slogan">
                Let's get Suki-ing!
              </div>
              <div className="new-guest-page__fifth-section-main-text-button-container">
                <Link to="/signup">
                  <button
                    className="new-guest-page__fifth-section-main-text-link-button"
                    href="#"
                    style={{ marginRight: "60px" }}
                  >
                    SIGN UP
                  </button>
                </Link>
                <Link to="/login">
                  <button
                    className="new-guest-page__fifth-section-main-text-link-button"
                    href="#"
                  >
                    LOG IN
                  </button>
                </Link>
              </div>
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
                <img
                  src={whiteLogo}
                  className="new-guest-page__footer-suki-logo"
                />
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
      </main>
    </div>
  );
}

export default NewGuestPage;
