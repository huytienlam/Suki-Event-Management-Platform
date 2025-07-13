import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import "../assets/SearchPage.css";
import SukiGreen from "../assets/Logo/SukiColor.svg";
import { Link, useLocation as useReactLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { searchEvent } from "../API.js";
import {
  FaHome,
  FaCompass,
  FaHeart,
  FaCog,
  FaRegCalendarAlt,
} from "react-icons/fa";

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

function LeftSideBar() {
  const [isHomeClicked, setIsHomeClicked] = useState(false);
  const [isExploreClicked, setIsExploreClicked] = useState(false);
  const [isFavoritesClicked, setIsFavoritesClicked] = useState(false);
  const [isSettingsClicked, setIsSettingsClicked] = useState(false);
  const [isCreateEventClicked, setIsCreateEventClicked] = useState(false);
  const userIDExists = localStorage.getItem("UserID") !== null;
  const handleClickMain = () => {
    setIsHomeClicked(true);
    window.scrollTo(0, 0); // Cuộn về đầu trang
  };
  const handleClickExplore = () => {
    setIsExploreClicked(true);
  };
  const handleClickFavorites = () => {
    setIsFavoritesClicked(true);
  };
  const handleClickSettings = () => {
    setIsSettingsClicked(true);
  };
  const handleClickCreateEvent = () => {
    setIsCreateEventClicked(true);
  };
  return (
    <div className="searchpage__left-side">
      <Link
        to="/mainpage"
        className="searchpage__menu-item"
        onClick={handleClickMain}
        style={{ cursor: "pointer" }}
      >
        <span className="searchpage__icon">
          <FaHome
            className="icon"
            style={{ color: isHomeClicked ? "#ff7383" : "#2d158f" }}
          />
        </span>
        <span
          className="searchpage__text"
          style={{ color: isHomeClicked ? "#ff7383" : "#2d158f" }}
        >
          Home
        </span>
      </Link>
      <Link
        to="/search"
        className="searchpage__menu-item"
        onClick={handleClickExplore}
        style={{ cursor: "pointer" }}
      >
        <span className="searchpage__icon">
          <FaCompass
            className="icon"
            style={{ color: isExploreClicked ? "#ff7383" : "#ff7383" }}
          />
        </span>
        <span
          className="searchpage__text"
          style={{ color: isExploreClicked ? "#ff7383" : "#ff7383" }}
        >
          Explore
        </span>
      </Link>
      <div
        className="searchpage__menu-item"
        onClick={handleClickFavorites}
        style={{ cursor: "pointer" }}
      >
        <span className="searchpage__icon">
          <FaHeart
            className="icon"
            style={{ color: isFavoritesClicked ? "#ff7383" : "#2d158f" }}
          />
        </span>
        <span
          className="searchpage__text"
          style={{ color: isFavoritesClicked ? "#ff7383" : "#2d158f" }}
        >
          Favorites
        </span>
      </div>
      {userIDExists && (
        <>
          <Link
            to="/setting"
            className="main-page__menu-item"
            onClick={handleClickSettings}
            style={{ cursor: "pointer" }}
          >
            <span className="main-page__icon">
              <FaCog
                className="icon"
                style={{ color: isSettingsClicked ? "#ff7383" : "#2d158f" }}
              />
            </span>
            <span
              className="main-page__text"
              style={{ color: isSettingsClicked ? "#ff7383" : "#2d158f" }}
            >
              Settings
            </span>
          </Link>
          <div className="main-page__menu-gap"></div>
          <Link
            to="/createvent"
            className="main-page__menu-item-create"
            onClick={handleClickCreateEvent}
            style={{ cursor: "pointer" }}
          >
            <span className="main-page__icon">
              <FaRegCalendarAlt className="icon" />
            </span>
            <span className="main-page__text">Create Event</span>
          </Link>{" "}
        </>
      )}
    </div>
  );
}

function Result(props) {
  const navigate = useNavigate();
  const userIDExists = localStorage.getItem("UserID") !== null;
  const movetoEvent = () => {
    if (userIDExists) {
      localStorage.setItem("eventid", props.id);
      window.scrollTo(0, 0); // Scroll to top
      navigate(`/event?id=${props.id}`);
    }
  };
  return (
    <div className="searchpage__result" onClick={movetoEvent}>
      <div className="searchpage__result-author-img">
        <img
          src={`data:${props.profileImg.contentType};base64,${props.profileImg.imageBase64}`}
          alt="Profile img"
        />
      </div>
      <div className="searchpage__result_content">
        <h3>{props.authorName}</h3>
        <p>{props.content}</p>
      </div>
    </div>
  );
}

function NoResults() {
  return (
    <div className="searchpage__no-results">
      <h2>No Results Found!</h2>
      <p>
        Sorry, but we couldn't find any events matching your search criteria.
      </p>
    </div>
  );
}

function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [locationFilter, setLocationFilter] = useState(""); // Đổi tên location thành locationFilter
  const location = useReactLocation(); // Đổi tên useLocation thành useReactLocation
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q")?.toLowerCase() || "";

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
          .includes(searchQuery);
        const matchesCategory = selectedCategory
          ? event.eventtype === selectedCategory
          : true;
        const matchesDateRange =
          (!startDate || eventDate >= startDate) &&
          (!endDate || eventDate <= endDate);
        const matchesLocation = locationFilter
          ? event.location.toLowerCase().includes(locationFilter.toLowerCase())
          : true;

        return matchesQuery && matchesCategory && matchesDateRange && matchesLocation;
      });
      setFilteredEvents(filtered);
    };
    filterEvents();
  }, [events, searchQuery, selectedCategory, startDate, endDate, locationFilter]); // Sửa tên biến trong dependencies

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

  const clearStartDate = () => setStartDate(null);
  const clearEndDate = () => setEndDate(null);

  // Cập nhật giá trị locationFilter khi người dùng nhập
  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value); // Sửa tên biến trong hàm xử lý
  };

  return (
    <div className="searchpage__main-container">
      <NavBar authorImg={SukiGreen} />
      <div className="searchpage__container">
        <LeftSideBar />
        <div className="searchpage__centerbar">
          {loading ? (
            <Loading />
          ) : filteredEvents.length === 0 ? (
            <NoResults />
          ) : (
            filteredEvents.map((event) => (
              <Result
                key={event._id} // Add a unique key for each result
                id={event._id}
                profileImg={event.logoevent}
                authorName={event.eventname}
                content={event.descriptionevent}
              />
            ))
          )}
        </div>
        <div className="searchpage__rightbar">
          <div className="searchpage__sidebar">
            <div className="searchpage__filter-section">
              <h3 className="searchpage__title">Filter</h3>
              <div className="searchpage__category">
                <h4 className="searchpage__subtitle">Category</h4>
                <ul className="searchpage__category-list">
                  {categories.map((category, index) => (
                    <li key={index} className="searchpage__category-item">
                      <input
                        type="checkbox"
                        id={`searchpage__category-${index}`}
                        className="searchpage__checkbox"
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <label
                        htmlFor={`searchpage__category-${index}`}
                        className="searchpage__label"
                      >
                        {category}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="searchpage__date">
                <h4 className="searchpage__subtitle">Date</h4>
                <label
                  htmlFor="searchpage__start-date"
                  className="searchpage__label"
                >
                  Start Date{" "}
                </label>
                <div className="searchpage__datepicker-container">
                  <DatePicker
                    id="start-date"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    placeholderText="mm/dd/yyyy"
                    className="searchpage__input"
                  />
                  <button
                    type="button"
                    className="searchpage__clear-button"
                    onClick={clearStartDate}
                  >
                    Clear
                  </button>
                </div>
                <label
                  htmlFor="searchpage__end-date"
                  className="searchpage__label"
                >
                  End Date
                </label>
                <div className="searchpage__datepicker-container">
                  <DatePicker
                    id="end-date"
                    selected={endDate}
                    onChange={handleEndDateChange}
                    placeholderText="mm/dd/yyyy"
                    className="searchpage__input"
                    minDate={startDate}
                  />
                  <button
                    type="button"
                    className="searchpage__clear-button"
                    onClick={clearEndDate}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="searchpage__location">
                <h4 className="searchpage__subtitle">Location</h4>
                <input
                  type="text"
                  placeholder="Input Location here"
                  className="searchpage__input"
                  value={locationFilter} // Sửa tên biến trong value
                  onChange={handleLocationChange} // Sửa tên hàm xử lý
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
