import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/NavBar.css";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LuTicket } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import { FaCog } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import Suki from "../assets/Logo/SukiWhite.svg";
import { renderProfile, GetNotification } from "../API";

function Navbar() {
  const navigate = useNavigate();
  const idaccount = localStorage.getItem("UserID");
  const profile = localStorage.getItem("ProfileID");
  const [url, setUrl] = useState(
    "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
  );
  const [name, setName] = useState("Guest");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [dropdownActive, setDropdownActive] = useState(false);
  const [notificationDropdownActive, setNotificationDropdownActive] =
    useState(false);
  const [ticketDropdownActive, setTicketDropdownActive] = useState(false);
  const [notification, setNotification] = useState([]);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSetting = () => {
    navigate("/setting");
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`); // Navigate with query parameter
  };

  useEffect(() => {
    const getImg = async () => {
      const response = await renderProfile({ idaccount });
      if (response.success) {
        localStorage.setItem("ProfileID", response.data._id);
        if (response.data.avatar != null)
          setUrl(
            `data:${response.data.avatar.contentType};base64,${response.data.avatar.imageBase64}`
          );
        setName(response.data.idaccount.username);
      }
    };
    getImg();
  }, [idaccount]);
  const toggleDropdown = () => {
    setDropdownActive(!dropdownActive);
    setTicketDropdownActive(false);
    setNotificationDropdownActive(false);
  };

  const toggleNotificationDropdown = async () => {
    setNotificationDropdownActive(!notificationDropdownActive);
    if (notification.length == 0) {
      const response = await GetNotification({ profile });
      if (response.success) {
        setNotification(response.data);
      }
    }
    setTicketDropdownActive(false);
    setDropdownActive(false);
  };

  const toggleTicketDropdown = () => {
    setTicketDropdownActive(!ticketDropdownActive);
    setNotificationDropdownActive(false);
    setDropdownActive(false);
  };
  const timeAgo = (dateString) => {
    const eventDate = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now - eventDate) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/mainpage" className="logo">
          <img src={Suki} alt="Logo" />
        </Link>
        <span>SUKI</span>
      </div>
      <div className="navbar-center">
        <form className="search-box" onSubmit={handleSearch}>
          <IoSearchOutline
            style={{ color: "white", cursor: "pointer" }}
            onClick={handleSearch}
          />
          <input
            type="text"
            placeholder="Event"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" style={{ display: "none" }}>
            Search
          </button>
        </form>
      </div>
      <div className="navbar-right">
        <ul>
          <li onClick={toggleNotificationDropdown}>
            <IoMdNotificationsOutline
              size={30}
              style={{
                color: notificationDropdownActive ? "#ff7383" : "white",
                backgroundColor: notificationDropdownActive
                  ? "white"
                  : "transparent",
                borderRadius: "50%",
                padding: "5px",
              }}
            />
            <div
              className={`notification-dropdown ${
                notificationDropdownActive ? "active" : ""
              }`}
            >
              <div className="notification-card">
                <div className="nav-bar__card-title">Notifications</div>
                <div className="nav-bar__card-list">
                  {notification
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <div className="nav-bar__card-list-part" key={index}>
                        <div
                          className={`nav-bar__card-list-part-${"pink"}`}
                        ></div>
                        <div className="nav-bar__card-list-part-info">
                          <div className="nav-bar__card-list-part-info-main">
                            {item.content}
                          </div>
                          <div className="nav-bar__card-list-part-info-time">
                            {timeAgo(item.Date_Noti)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </li>
          <li onClick={toggleTicketDropdown}>
            <LuTicket
              size={30}
              style={{
                color: ticketDropdownActive ? "#ff7383" : "white",
                backgroundColor: ticketDropdownActive ? "white" : "transparent",
                borderRadius: "50%",
                padding: "5px",
              }}
            />
            <div
              className={`ticket-dropdown ${
                ticketDropdownActive ? "active" : ""
              }`}
            >
              <div className="ticket-card">
                <div className="nav-bar__card-title">Tickets</div>
                <div className="nav-bar__card-list">
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div className="profile_img" onClick={toggleDropdown}>
          <img src={url} alt="profile-img" />
          <div className={`dropdown-menu ${dropdownActive ? "active" : ""}`}>
            <div className="profile-section">
              <img src={url} alt="profile-img" />
              <div className="profile-info">
                <p>{name}</p>
              </div>
            </div>
            {
              <>
                <div className="menu-item" onClick={handleSetting}>
                  <FaCog className="icon" />
                  <span>Settings</span>
                </div>
                <div className="menu-item" onClick={handleLogout}>
                  <LuLogOut className="icon" />
                  <span>Log out</span>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
