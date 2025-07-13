import React, { useState, useEffect } from "react";
import logo from "../assets/Logo/SukiWhite.svg";
import "../assets/AdminHomePage.css";
import { Link, useNavigate } from "react-router-dom";
import { AdminRenderEvent, AdminListComment } from "../API";

const EventCard = ({ id, username, timeAgo, eventName, status, avatar }) => {
  const navigate = useNavigate();
  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Rejected":
        return "status-rejected";
      case "Pending":
        return "status-pending";
      default:
        return "";
    }
  };
  const movetoEvent = () => {
    if (status == "Pending") {
      localStorage.setItem("eventid", id);
      window.scrollTo(0, 0); // Scroll to top
      navigate(`/admin/review?id=${id}`);
    }
  };

  return (
    <div className="admin-homepage__event-card">
      <div className="user-info">
        <div className="user-avatar">
          <img
            className="user-avatar"
            src={avatar ? `data:${avatar.contentType};base64,${avatar.imageBase64}`: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
          />
        </div>
        <div className="user-details">
          <p className="username">{username}</p>
          <p className="time-ago">{timeAgo}</p>
        </div>
      </div>
      <p className="event-name">{eventName}</p>
      <div className="event-details">
        <button
          className={`event-status ${getStatusClass(status)}`}
          onClick={() => movetoEvent(id)}
        >
          {status}
        </button>
      </div>
    </div>
  );
};

const AdminHomePage = () => {
  const [activeSection, setActiveSection] = useState("Events");
  const [profileActive, setProfileActive] = useState(false); // State to toggle logout button
  const [events, setEvents] = useState([]);
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
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await AdminRenderEvent();
        if (response.success) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "Accounts":
        return <AdminAccounts />;
      case "Events":
        return (
          <div className="admin-homepage__event-list">
            {events
              .slice()
              .reverse()
              .map((event) => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  username={event.profile.fullname}
                  timeAgo={timeAgo(event.eventcreationdate)}
                  eventName={event.eventname}
                  status={event.status}
                  avatar={event.profile.avatar}
                />
              ))}
          </div>
        );
      case "Comments":
        return <AdminComments />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-homepage__container">
      <header>
        <div className="admin-homepage__header-img-container">
          <img src={logo} alt="Logo" />
          <p className="admin-homepage__header-website-title">SUKI</p>
        </div>
        <div className="admin-homepage__header-navigation-bar">
          <div
            className={`admin-homepage__header-navigation-bar-button ${
              activeSection === "Accounts" ? "active" : ""
            }`}
            onClick={() => setActiveSection("Accounts")}
          >
            ACCOUNTS
          </div>
          <div
            className={`admin-homepage__header-navigation-bar-button ${
              activeSection === "Events" ? "active" : ""
            }`}
            onClick={() => setActiveSection("Events")}
          >
            EVENTS
          </div>
          <div
            className={`admin-homepage__header-navigation-bar-button ${
              activeSection === "Comments" ? "active" : ""
            }`}
            onClick={() => setActiveSection("Comments")}
          >
            COMMENTS
          </div>
        </div>
        <div
          className={`admin-homepage__profile-container ${
            profileActive ? "active" : ""
          }`}
          onClick={() => setProfileActive(!profileActive)}
        >
          <p className="admin-homepage__profile-container-name">
            Administrator
          </p>
          <Link to="/">
            <button>Log Out</button>
          </Link>
        </div>
      </header>
      <div className="admin-homepage__list-container">{renderSection()}</div>
    </div>
  );
};

const AdminAccounts = () => {
  return (
    <div className="admin-homepage__account-list">
      <div className="admin-homepage__account-card">
        <div className="user-info">
          <div className="user-avatar"></div>
          <div className="user-details">
            <p className="username">Username</p>
            <p className="time-ago">Participant</p>
          </div>
        </div>
        <div className="full-information">
          <p className="small-info">
            <strong>Full Name: </strong>This Is Name
          </p>
          <p className="small-info">
            <strong>Gender: </strong>Female
          </p>
          <p className="small-info">
            <strong>University: </strong>VNU-HCM, University Of Science
          </p>
          <p className="small-info">
            <strong>Phone: </strong>0987654321
          </p>
          <p className="small-info">
            <strong>ID: </strong>22127000
          </p>
          <p className="small-info">
            <strong>DOB: </strong>01/01/2004
          </p>
          <p className="small-info">
            <strong>Address: </strong>TP. HCM
          </p>
        </div>
        <div className="event-details">
          <button className="event-status ban-user">Ban User</button>
          <button className="event-status delete-user">Delete User</button>
        </div>
      </div>

      <div className="admin-homepage__account-card">
        <div className="user-info">
          <div className="user-avatar"></div>
          <div className="user-details">
            <p className="username">Username</p>
            <p className="time-ago">Organizer</p>
          </div>
        </div>
        <div className="full-information">
          <p className="small-info">
            <strong>Full Name: </strong>This Is Name
          </p>
          <p className="small-info">
            <strong>Gender: </strong>Male
          </p>
          <p className="small-info">
            <strong>University: </strong>VNU-HCM, University Of Science
          </p>
          <p className="small-info">
            <strong>Phone: </strong>0987654321
          </p>
          <p className="small-info">
            <strong>ID: </strong>22127000
          </p>
          <p className="small-info">
            <strong>DOB: </strong>01/01/2004
          </p>
          <p className="small-info">
            <strong>Address: </strong>TP. HCM
          </p>
        </div>
        <div className="event-details">
          <button className="event-status unban-user">Unban User</button>
          <button className="event-status delete-user">Delete User</button>
        </div>
      </div>
    </div>
  );
};

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [fullnames, setFullNames] = useState([]);
  const [avatars, setAvatars] = useState([]);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await AdminListComment();
        if (response.success) {
          setComments(response.comments);
          setFullNames(response.fullnames);
          setAvatars(response.avatars);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, []);

  return (
    <div className="admin-homepage__event-list">
      {comments.map((comment, index) => (
        <div className="admin-homepage__comment-card">
          <div className="user-info">
            <div className="user-avatar">
              <img
                className="user-avatar"
                src={avatars[index] ? `data:${avatars[index].contentType};base64,${avatars[index].imageBase64}`: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
              />
            </div>
            <div className="user-details">
              <p className="username">{fullnames[index]}</p>
            </div>
          </div>
          <div className="comment-container">
            <p className="event-name">Event Name</p>
            <p className="user-comment">{comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminHomePage;
