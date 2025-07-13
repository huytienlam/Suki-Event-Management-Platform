import React, { useState, useEffect } from "react";
import "../assets/ManageEvent.css";
import { useNavigate } from "react-router-dom";
import { RenderDataEvent, Followers, CancelEvent, EditEvent } from "../API";
import Navbar from "../components/NavBar";

const ProfileImage = ({ avatar }) => {
  const image =
    avatar != null
      ? `data:${avatar.contentType};base64,${avatar.imageBase64}`
      : "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg";
  return (
    <div>
      <div className="manage-event-page-profile-image-container">
        <img
          src={image}
          alt="profile-img"
          className="manage-event-page-profile-img"
        />
      </div>
    </div>
  );
};

function Main_information(props) {
  const navigate = useNavigate();
  const profileID = localStorage.getItem("ProfileID");
  // Khởi tạo state với giá trị từ props
  const [formData, setFormData] = useState({
    description: props.description || "",
    date: props.date ? new Date(props.date) : null,
    rule: props.rule || "",
    time: props.time || "",
    location: props.location || "",
    participants: props.participants || 0,
    numberoftickets: props.numberoftickets || 0,
    tickettype: props.tickettype || "",
    price: props.price || 0,
    type: props.type || "0",
  });

  // Lưu giữ giá trị ban đầu để khôi phục khi hủy
  const [initialData] = useState({ ...formData });

  // Định dạng ngày theo dạng yyyy-MM-dd
  const formatDate = (date) => {
    if (!date) return ""; // Trường hợp không có ngày
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Cập nhật giá trị formData khi thay đổi các trường
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý khi nhấn nút Cancel
  const handleCancel = () => {
    setFormData(initialData);
  };

  // Xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.eventID = props.eventID;
    formData.profileID = profileID;
    const response = await EditEvent(formData);
    if (response.success) {
      navigate(`/event?id=${props.eventID}`);
    } else {
      alert("Failed to update event");
    }
  };

  // Xử lý thay đổi ngày
  const handleDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    setFormData((prevData) => ({
      ...prevData,
      date: newDate,
    }));
  };

  return (
    <form className="manage-event-page-account" onSubmit={handleSubmit}>
      <div className="manage-event-page-account-header">
        <h1 className="manage-event-page-account-title">Main Information</h1>
        <div className="manage-event-page-btn-container">
          <button
            type="button"
            className="manage-event-page-btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="submit" className="manage-event-page-btn-save">
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="manage-event-page-account-edit">
        <div className="manage-event-page__description-container">
          <label htmlFor="description">Description</label>
          <textarea
            maxLength="250"
            name="description"
            id="description"
            placeholder="250 word limit"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="manage-event-page__rules-container">
          <label htmlFor="rule">Rules</label>
          <textarea
            maxLength="250"
            name="rule"
            value={formData.rule}
            id="rule"
            placeholder="(if any)"
            onChange={handleChange}
          />
        </div>
        <div className="manage-event-page__date-n-time-container">
          <p>Date & Time</p>
          <div>
            <input
              required
              name="date"
              type="date"
              id="event-date"
              value={formatDate(formData.date)}
              onChange={handleDateChange}
            />

            <input
              required
              name="time"
              type="time"
              id="event-time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="manage-event-page__location-container">
          <label htmlFor="location">Location</label>
          <input
            required
            name="location"
            type="text"
            id="location"
            value={formData.location}
            className="manage-event-page__location"
            placeholder="Detailed Location"
            onChange={handleChange}
          />
        </div>

        {formData.type !== "Music" ? (
          <div className="manage-event-page__participant-container">
            <label htmlFor="participants">Participants</label>
            <input
              name="participants"
              type="number"
              id="participants"
              className="manage-event-page__participant"
              placeholder="Capacity"
              value={formData.participants}
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="manage-event-page__ticket-container">
            <p>Tickets</p>
            <div>
              <input
                type="number"
                name="numberoftickets"
                id="ticket-quantity"
                placeholder="Quantity"
                value={formData.numberoftickets}
                onChange={handleChange}
              />
              <select
                name="tickettype"
                value={formData.tickettype}
                onChange={handleChange}
              >
                <option value="0">Paid</option>
                <option value="1">Free</option>
                <option value="2">Donation</option>
              </select>
              <input
                type="number"
                name="price"
                id="ticket-price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>
      <div className="manage-event__copy-right-msg">
        <p>Suki Corporation © 2024</p>
      </div>
    </form>
  );
}

function Following(props) {
  const followers = props.followers;
  return (
    <div className="manage-event-page-account">
      <div className="manage-event-page-account-header">
        <h1 className="manage-event-page-account-title">Followers: {followers.length}</h1>
      </div>
      <div className="manage-event-page-notification-content">
        {followers.map((follower, index) => (
          <div
            key={index}
            className="manage-event-page-notification-content__popup-field-follower"
          >
            <div className="manage-event-page-profile-header">
              <ProfileImage avatar={follower.avatar} />
              <div className="manage-event-page-profile-text-container">
                <h1 className="manage-event-page-profile-title">
                  {follower.fullname}
                </h1>
                <p className="manage-event-page-profile-email">
                  {follower.email}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="manage-event__copy-right-msg">
          <p>Suki Corporation © 2024</p>
        </div>
      </div>
    </div>
  );
}

function Ticket(props) {

  return (
    <div className="manage-event-page-account">
      <div className="manage-event-page-account-header">
        <h1 className="manage-event-page-account-title">{(props.eventtype === "Music" || props.eventtype === "Festival") 
  ? `Ticket: ${props.ticket.length} orders` 
  : `Participants: ${props.ticket.length} people`
}</h1>
      </div>
      <div className="manage-event-page-setting-content">
        <div className="manage-event-page-setting-content__popup-field-tickets">
        {(props.eventtype !== "Music" && props.eventtype !== "Festival") ? (
          props.ticket.map((ticket, index) => (
            <div key={index} className="manage-event-page-setting-content__user-and-ticket">
              <div className="manage-event-page-profile-header">
                <ProfileImage avatar={ticket.avatar}/>
                <div className="manage-event-page-profile-text-container">
                  <h1 className="manage-event-page-profile-title">{ticket.fullname}</h1>
                  <p className="manage-event-page-profile-email">{ticket.email}</p>
                </div>
                </div>
            <button className="ticket-amount">Participated</button>
          </div>
        ))) : (props.ticket.map((ticket, index) => (
            <div key={index} className="manage-event-page-setting-content__user-and-ticket">
              <div className="manage-event-page-profile-header">
                <ProfileImage avatar={ticket.avatar}/>
                <div className="manage-event-page-profile-text-container">
                  <h1 className="manage-event-page-profile-title">{ticket.fullname}</h1>
                  <p className="manage-event-page-profile-email">{ticket.email}</p>
                </div>
                </div>
            <button className="ticket-amount">{ticket.ticketorder} Tickets</button>
          </div>)))}
        </div>
        <div className="manage-event__copy-right-msg">
          <p>Suki Corporation © 2024</p>
        </div>
      </div>
    </div>
  );
}

function Cancel_event(props) {
  const eventID = props.eventID;
  const navigate = useNavigate();
  const cancel = async () => {
    const response = await CancelEvent({ eventID });
    if (response.success) {
      navigate("/mainpage");
    } else {
      alert("Failed to cancel event");
    }
  }
  return (
    <div className="manage-event-page-account">
      <div className="manage-event-page-account-header">
        <h1 className="manage-event-page-account-title">Cancel</h1>
      </div>
      <div className="manage-event-page-logout-content">
        <h2 className="manage-event-page-account-question">
          Do you want to cancel the event?
        </h2>
        <button className="manage-event-page-account-button" onClick={cancel}>
          <span>Cancel</span>
        </button>
      </div>
      <div className="manage-event__copy-right-msg">
        <p>Suki Corporation © 2024</p>
      </div>
    </div>
  );
}

function ManageEvent() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Main_Info");
  const [url, setUrl] = useState(
    "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
  );
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const eventID = queryParams.get("id")?.toLowerCase() || "";
  const [event, setEvent] = useState({});
  const [followers, setFollowers] = useState([]);
  const [ticket, setTicket] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await RenderDataEvent({ eventID });
        const followers = await Followers({ eventID });
        if (followers.success) {
          setFollowers(followers.followers);
          setTicket(followers.data);
        }
        if (response.success) {
          setEvent(response.data);
          setUrl(response.data.logoevent);
          setLoading(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "Main_Info":
        return (
          <Main_information
            description={event.descriptionevent}
            participants={event.participants}
            numberoftickets={event.numberoftickets}
            tickettype={event.tickettype}
            price={event.price}
            rule={event.rulesevent}
            date={event.eventdate}
            time={event.eventtime}
            location={event.location}
            type={event.eventtype}
            eventID={eventID}
          />
        );
      case "Following":
        return <Following followers={followers} />;
      case "Ticket":
        return <Ticket eventtype={event.eventtype} ticket={ticket}/>;
      case "Cancel":
        return <Cancel_event eventID={eventID}/>;
      default:
        return (
          <Main_information
            description={event.descriptionevent}
            participants={event.participants}
            numberoftickets={event.numberoftickets}
            tickettype={event.tickettype}
            price={event.price}
            rule={event.rulesevent}
            date={event.eventdate}
            time={event.eventtime}
            location={event.location}
            type={event.eventtype}
          />
        );
    }
  };

  return (
    loading && (
      <div className="manage-event-page-container">
        <Navbar className="manage-event-page_navbar" />

        <div className="manage-event-page-profile">
          <div className="manage-event-page-profile-header">
            <ProfileImage avatar={url} />
            <div className="manage-event-page-profile-text-container">
              <h1 className="manage-event-page-profile-title">
                {event.eventname}
              </h1>
              <p className="manage-event-page-profile-email">
                {event.eventtype}
              </p>
            </div>
          </div>
          <div className="manage-event-page-menu">
            <a
              className={`manage-event-page-menu-link ${
                activeSection === "Main_Info" ? "manage-event-page-active" : ""
              }`}
              onClick={() => setActiveSection("Main_Info")}
            >
              <i className="manage-event-page-menu-icon"></i>
              Main Info
            </a>
            <a
              className={`manage-event-page-menu-link ${
                activeSection === "Following" ? "manage-event-page-active" : ""
              }`}
              onClick={() => setActiveSection("Following")}
            >
              <i className="manage-event-page-menu-icon"></i>
              Followers
            </a>
            <a
              className={`manage-event-page-menu-link ${
                activeSection === "Ticket" ? "manage-event-page-active" : ""
              }`}
              onClick={() => setActiveSection("Ticket")}
            >
              <i className="manage-event-page-menu-icon"></i>
              {(event.eventtype === "Music" || event.eventtype === "Festival") ? "Ticket" : "Participants"}
            </a>
            <a
              className={`manage-event-page-menu-link ${
                activeSection === "Cancel" ? "manage-event-page-active" : ""
              }`}
              onClick={() => setActiveSection("Cancel")}
            >
              <i className="manage-event-page-menu-icon"></i>
              Cancel
            </a>
            <a
              className={`manage-event-page-menu-link ${
                activeSection === "Main" ? "manage-event-page-active" : ""
              }`}
              onClick={() => {navigate(`/event?id=${localStorage.getItem("eventid")}`);}}
            >
              <i className="manage-event-page-menu-icon"></i>
              Back to event
            </a>
          </div>
        </div>
        {renderSection()}
      </div>
    )
  );
}

export default ManageEvent;
