import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import "../assets/MainPage.css";
import { FaMusic } from "react-icons/fa";
import { GiVideoConference } from "react-icons/gi";
import SukiGreen from "../assets/Logo/SukiColor.svg";
import { FaSort } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";
import { FaSortUp } from "react-icons/fa";
import {
  FaHome,
  FaCompass,
  FaHeart,
  FaCog,
} from "react-icons/fa";
import { GiHeartPlus } from "react-icons/gi";
import { FaStar, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Post from "../components/Post.jsx";
import { renderMainPage, RenderEventMP } from "../API.js";

function LeftSideBar() {
  const [isHomeClicked, setIsHomeClicked] = useState(false);
  const [isExploreClicked, setIsExploreClicked] = useState(false);
  const [isFavoritesClicked, setIsFavoritesClicked] = useState(false);
  const [isSettingsClicked, setIsSettingsClicked] = useState(false);
  const userIDExists = localStorage.getItem("UserID") !== null;

  const handleClickMain = () => {
    setIsHomeClicked(true);
    window.scrollTo(0, 0); // Cuộn về đầu trang
    window.location.reload();
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
  return (
    <div className="main-page__left-side">
      <div
        className="main-page__menu-item"
        onClick={handleClickMain}
        style={{ cursor: "pointer" }}
      >
        <span className="main-page__icon">
          <FaHome
            className="icon"
            style={{ color: isHomeClicked ? "#ff7383" : "#ff7383" }}
          />
        </span>
        <span
          className="main-page__text"
          style={{ color: isHomeClicked ? "#ff7383" : "#ff7383" }}
        >
          Home
        </span>
      </div>
      <Link
        to="/search"
        className="main-page__menu-item"
        onClick={handleClickExplore}
        style={{ cursor: "pointer" }}
      >
        <span className="main-page__icon">
          <FaCompass
            className="icon"
            style={{ color: isExploreClicked ? "#ff7383" : "#2d158f" }}
          />
        </span>
        <span
          className="main-page__text"
          style={{ color: isExploreClicked ? "#ff7383" : "#2d158f" }}
        >
          Explore
        </span>
      </Link>
      <div
        className="main-page__menu-item"
        onClick={handleClickFavorites}
        style={{ cursor: "pointer" }}
      >
        <span className="main-page__icon">
          <FaHeart
            className="icon"
            style={{ color: isFavoritesClicked ? "#ff7383" : "#2d158f" }}
          />
        </span>
        <span
          className="main-page__text"
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
            style={{ cursor: "pointer" }}
          >
            <span className="main-page__text">Create Event</span>
          </Link>
        </>
      )}
    </div>
  );
}

function RightSidebar() {
  const navigate = useNavigate();
  const [eventFollow, setEventFollow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventOwner, setEventOwner] = useState([]);
  const profile = localStorage.getItem("ProfileID");
  const movetoEvent = (eventID) => {
    localStorage.setItem("eventid", eventID);
    window.scrollTo(0, 0); // Scroll to top
    navigate(`/event?id=${eventID}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await RenderEventMP({ profile });
        setEventFollow(response.event_follow);
        setEventOwner(response.event_orga);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };
  
    fetchEvents();
  }, [profile]);
  
  return (
    <div className="main-page__right-side">
      <div className="main-page__sidebar-news-scroll">
        <h1>Followed</h1>
        <div className="main-page__event_list-right">
          {loading ? (
            <p>Loading followed events...</p>
          ) : eventFollow.length > 0 ? (
            eventFollow.map((event, index) => (
              <div
                key={event._id || index}
                className="main-page__event-info"
              >
                <div className="main-page__event-avatar">
                  <img
                    className="main-page__event-avatar"
                    onClick={() => movetoEvent(event._id)}
                    src={`data:${event.logoevent.contentType};base64,${event.logoevent.imageBase64}`}
                  />
                </div>
                <div className="main-page__event-details">
                  <p className="main-page__event-name">{event.eventname}</p>
                  <p className="main-page__event-category">
                    {event.eventtype}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No events followed</p>
          )}
        </div>
      </div>
      
      <div className="main-page__sidebar-news">
        <h1>Organized</h1>
        <div className="main-page__event_list-right">
          {loading ? (
            <p>Loading organized events...</p>
          ) : eventOwner.length > 0 ? (
            eventOwner.map((event, index) => (
              <div
                key={event._id || index}
                onClick={() => movetoEvent(event._id)}
                className="main-page__event-info"
              >
                <div className="main-page__event-avatar">
                  <img
                    className="main-page__event-avatar"
                  
                    src={`data:${event.logoevent.contentType};base64,${event.logoevent.imageBase64}`}
                  />
                </div>
                <div className="main-page__event-details">
                  <p className="main-page__event-name">{event.eventname}</p>
                  <p className="main-page__event-category">
                    {event.eventtype}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No events organized</p>
          )}
        </div>
      </div>
  
      <div className="main-page__sidebar-useful-link">
        <div className="main-page__copy-right-msg">
          <p>Suki Corporation © 2024</p>
        </div>
      </div>
    </div>
  );
  
}

const CenterSide = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sortType, setSortType] = useState("none");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await renderMainPage(); // Assuming renderMainPage is defined elsewhere
        setPosts(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const events = [
    { name: "Music", icon: <FaMusic style={{ color: "white" }} /> },
    { name: "Charity", icon: <GiHeartPlus style={{ color: "white" }} /> },
    { name: "Team Building", icon: <FaUsers style={{ color: "white" }} /> },
    { name: "Meeting", icon: <GiVideoConference style={{ color: "white" }} /> },
    { name: "Festival", icon: <FaStar style={{ color: "white" }} /> },
  ];

  const handleEventClick = (index) => {
    if (selectedEvent == index) setSelectedEvent(null);
    else setSelectedEvent(index);
  };

  const handleClickSort = () => {
    if (sortType === "none") {
      setSortType("top");
    } else if (sortType === "top") {
      setSortType("down");
    } else {
      setSortType("none");
    }
  };

  const filteredPosts =
    selectedEvent === null
      ? posts
      : posts.filter(
          (post) => post.eventID.eventtype === events[selectedEvent].name
        );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.postcreationdate);
    const dateB = new Date(b.postcreationdate);

    if (sortType === "top") {
      return dateB - dateA; // Descending order
    } else if (sortType === "down") {
      return dateA - dateB; // Ascending order
    }
    return 0; // No sorting
  });

  return (
    <div className="main-page__center-side">
      <div className="main-page__event-nav-bar">
        {events.map((event, index) => (
          <div
            className={`main-page__event-item ${
              selectedEvent === index ? "main-page__selected" : ""
            }`}
            key={index}
            onClick={() => handleEventClick(index)}
          >
            <div className="main-page__event-icon">{event.icon}</div>
            <span>{event.name}</span>
          </div>
        ))}
      </div>

      <div
        className="main-page__sort-by"
        onClick={handleClickSort}
        style={{ cursor: "pointer" }}
      >
        <hr />
        <p>
          Sort by:{" "}
          <span>
            {sortType}{" "}
            {sortType === "none" ? (
              <FaSort />
            ) : sortType === "top" ? (
              <FaSortUp />
            ) : (
              <FaSortDown />
            )}
          </span>
        </p>
      </div>

      {loading ? (
        <div>
        </div>
      ) :  (
        sortedPosts.map((post) => (
          <Post
            key={post._id}
            date={post.postcreationdate}
            userName={post.eventID.eventname}
            content={post.descriptionpost}
            postImg={post.images}
            authorImg={post.eventID.logoevent}
            eventID={post.eventID._id}
            postID={post._id}
          />
        ))
      )}
    </div>
  );
};

function MainPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await renderMainPage(); // Assuming renderMainPage is defined elsewhere
        setPosts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="main-page__main-container">
      <NavBar authorImg={SukiGreen} />
      <div className="main-page__container">
        <LeftSideBar />
        <RightSidebar />
        <CenterSide />
      </div>
    </div>
  );
}

export default MainPage;
