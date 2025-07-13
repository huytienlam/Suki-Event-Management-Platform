import React, { useState, useEffect } from "react";
import "../assets/GuestSearchPage.css";
import "../assets/NavBar.css";
import whiteLogo from "../assets/Logo/SukiWhite.svg";
import { Link, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { searchEvent } from "../API.js";
import { IoSearchOutline } from "react-icons/io5";

import Ring1 from "../assets/Abstract Objects/Ellipse 9-1.svg";
import Polygon1 from "../assets/Abstract Objects/Polygon 1-2.svg";
import Ellipse1 from "../assets/Abstract Objects/Ellipse 8-4.svg";
import Ellipse2 from "../assets/Abstract Objects/Ellipse 7-1.svg";
import Ellipse3 from "../assets/Abstract Objects/Ellipse 7.svg";
import Polyline1 from "../assets/Abstract Objects/Vector 8-3.svg";

function AbstractObjects() {
  return (
    <div className="guest-searchpage__abstract-objects">
      <div className="guest-searchpage__top-right-gradient" />
      <div className="guest-searchpage__bottom-left-gradient" />

      <img
        src={Polygon1}
        className="guest-searchpage__first-section-polygon-1"
      />
      <img
        src={Ellipse2}
        className="guest-searchpage__first-section-ellipse-2"
      />
      <img
        src={Ellipse1}
        className="guest-searchpage__first-section-ellipse-1"
      />
      <img
        src={Ellipse3}
        className="guest-searchpage__first-section-ellipse-3"
      />
      <img
        src={Polyline1}
        className="guest-searchpage__first-section-polyline-1"
      />
      <img src={Ring1} className="guest-searchpage__first-section-ring-1" />
    </div>
  );
}

function Loading() {
  return (
    <div className="loading__typing-indicator">
      <div className="loading__typing-circle"></div>
      <div className="loading__typing-circle"></div>
      <div className="loading__typing-circle"></div>
      <div className="loading__typing-shadow"></div>
      <div className="loading__typing-shadow"></div>
      <div className="loading__typing-shadow"></div>
    </div>
  );
}

function Result(props) {
  return (
    <div className="guest-searchpage__result">
      <div className="guest-searchpage__result-author-img">
        <img
          src={`data:${props.profileImg.contentType};base64,${props.profileImg.imageBase64}`}
          alt="Profile img"
        />
      </div>
      <div className="guest-searchpage__result_content">
        <div class="guest-searchpage__result_content-event-name">
          {props.authorName}
        </div>
        <div class="guest-searchpage__result_content-event-type">
          {props.content}
        </div>
      </div>
    </div>
  );
}

function NoResults() {
  return (
    <div className="guest-searchpage__no-results">
      <h2>No Results Found!</h2>
      <p>
        Sorry, but we couldn't find any events matching your search criteria.
      </p>
    </div>
  );
}

function GuestSearchPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q")?.toLowerCase() || "";
  const [searchQueryGuest, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await searchEvent(); // Fetch all events
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const filterEvents = () => {
      const filtered = events.filter((event) => {
        const eventDate = new Date(event.eventdate);
        const matchesQuery = event.eventname
          .toLowerCase()
          .includes(searchQueryGuest);
        const matchesCategory = selectedCategory
          ? event.eventtype === selectedCategory
          : true;
        const matchesDateRange =
          (!startDate || eventDate >= startDate) &&
          (!endDate || eventDate <= endDate);

        return matchesQuery && matchesCategory && matchesDateRange;
      });
      setFilteredEvents(filtered);
    };
    filterEvents();
  }, [events, searchQueryGuest, selectedCategory, startDate, endDate]);

  const categories = [
    "Music",
    "Charity",
    "Team Building",
    "Festival",
    "Meeting",
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    if (startDate && date >= startDate) {
      setEndDate(date);
    } else {
      alert("End date must be greater than or equal to start date");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearStartDate = () => setStartDate(null);
  const clearEndDate = () => setEndDate(null);

  return (
    <div className="guest-searchpage__main-container">
      <AbstractObjects />

      <header className="guest-searchpage__header">
        <div className="guest-searchpage__header-gradient-after-logo" />
        <div className="guest-searchpage__header-left-section">
          <img src={whiteLogo} className="guest-searchpage__header-suki-logo" />
          <p className="guest-searchpage__header-website-title">SUKI</p>
        </div>
        <div className="guest-searchpage__header-right-section">
          <ul className="guest-searchpage__header-navigation-bar">
            <Link className="guest-searchpage__header-navigation-bar-button-here">
              SEARCH
            </Link>
            <Link
              to="/"
              className="guest-searchpage__header-navigation-bar-button"
            >
              HOME
            </Link>
            <Link
              to="/aboutus"
              className="guest-searchpage__header-navigation-bar-button"
            >
              ABOUT
            </Link>
            <Link
              to="/login"
              className="guest-searchpage__header-navigation-bar-button"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="guest-searchpage__header-navigation-bar-button"
            >
              SIGN UP
            </Link>
          </ul>
        </div>
      </header>

      <div className="guest-searchpage__container">
        <div className="guest-searchpage__centerbar">
          <div className="guest-searchpage-center">
            <form className="search-box" onSubmit={handleSearch}>
              <IoSearchOutline
                style={{ color: "white", cursor: "pointer" }}
                onClick={handleSearch}
              />
              <input
                type="text"
                placeholder="Search for events"
                value={searchQueryGuest}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" style={{ display: "none" }}>
                Search
              </button>
            </form>
          </div>

          <div className="guest-searchpage-searches">
            {loading ? (
              <Loading />
            ) : filteredEvents.length === 0 ? (
              <NoResults />
            ) : (
              filteredEvents.map((event) => (
                <Result
                  key={event._id} // Add a unique key for each result
                  profileImg={event.logoevent}
                  authorName={event.eventname}
                  content={event.descriptionevent}
                />
              ))
            )}
          </div>
        </div>

        <div className="guest-searchpage__rightbar">
          <div className="guest-searchpage__sidebar">
            <div className="guest-searchpage__filter-section">
              <h3 className="guest-searchpage__title">Filter</h3>
              <div className="guest-searchpage__category">
                <h4 className="guest-searchpage__subtitle">Category</h4>
                <ul className="guest-searchpage__category-list">
                  {categories.map((category, index) => (
                    <li key={index} className="guest-searchpage__category-item">
                      <input
                        type="checkbox"
                        id={`guest-searchpage__category-${index}`}
                        className="guest-searchpage__checkbox"
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <label
                        htmlFor={`guest-searchpage__category-${index}`}
                        className="guest-searchpage__label"
                      >
                        {category}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="guest-searchpage__date">
                <h4 className="guest-searchpage__subtitle">Date</h4>
                <label
                  htmlFor="guest-searchpage__start-date"
                  className="guest-searchpage__label"
                >
                  Start Date{" "}
                </label>
                <div className="guest-searchpage__datepicker-container">
                  <DatePicker
                    id="start-date"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    placeholderText="mm/dd/yyyy"
                    className="guest-searchpage__input"
                  />
                  <button
                    type="button"
                    className="guest-searchpage__clear-button"
                    onClick={clearStartDate}
                  >
                    Clear
                  </button>
                </div>
                <label
                  htmlFor="guest-searchpage__end-date"
                  className="guest-searchpage__label"
                >
                  End Date
                </label>
                <div className="guest-searchpage__datepicker-container">
                  <DatePicker
                    id="end-date"
                    selected={endDate}
                    onChange={handleEndDateChange}
                    placeholderText="mm/dd/yyyy"
                    className="guest-searchpage__input"
                    minDate={startDate}
                  />
                  <button
                    type="button"
                    className="guest-searchpage__clear-button"
                    onClick={clearEndDate}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="guest-searchpage__location">
                <h4 className="guest-searchpage__subtitle">Location</h4>
                <input
                  type="text"
                  placeholder="Input Location here"
                  className="guest-searchpage__input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestSearchPage;
