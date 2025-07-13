import React, { useState, useEffect, useCallback } from "react";
import "../assets/SettingPage.css";
import { useNavigate } from "react-router-dom";
import { renderProfile, updateProfile, ChangeAvatar, ChangePassword } from "../API";
import { FaCamera } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import Navbar from "../components/NavBar";

const ProfileImage = ({ initialUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    initialUrl != null
      ? `data:${initialUrl.contentType};base64,${initialUrl.imageBase64}`
      : "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
  );
  const [newImageFile, setNewImageFile] = useState(null);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleImageClick = () => {
    setIsPopupOpen(true);
  };
  const handleChangeAva = async () => {
    const formData = new FormData();
    formData.append("idaccount", localStorage.getItem("UserID")); // Thêm idaccount vào dữ liệu
    formData.append("avatar", newImageFile); // Thêm file vào dữ liệu
    const response = await ChangeAvatar(formData);
    if (response.success) setIsPopupOpen(false);
  };
  const handleClosePopup = async () => {
    setIsPopupOpen(false);
    setIsHovered(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setNewImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".png", ".jpg", ".svg", ".gif"],
    },
  });

  return (
    <div>
      <div
        className={`settingpage-profile-image-container ${
          isHovered ? "settingpage-hovered" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleImageClick}
      >
        <img
          src={imageUrl}
          alt="profile-img"
          className="settingpage-profile-img"
        />
        {isHovered && (
          <div className="settingpage-edit-overlay">
            <FaCamera className="settingpage-edit-icon" />
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div className="settingpage-popup">
          <div className="settingpage-popup-content">
            <button
              onClick={handleClosePopup}
              className="settingpage-close-button"
            >
              ×
            </button>
            <h2>Upload a New Avatar</h2>
            <div className="settingpage-avatar-preview" {...getRootProps()}>
              <input {...getInputProps()} />
              <img
                src={imageUrl}
                alt="Avatar Preview"
                className="settingpage-avatar-image"
              />
            </div>
            <button
              className="settingpage-save-button"
              onClick={handleChangeAva}
            >
              Save
            </button>
            <button
              className="settingpage-cancel-button"
              onClick={handleClosePopup}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function Account({ profile }) {
  const [formData, setFormData] = useState({
    fullname: profile.fullname || "",
    dob: profile.dob ? new Date(profile.dob) : null,
    sex: profile.sex || "",
    phone: profile.phone || "",
    address: profile.hometown || "",
    idcard: profile.idcard || "",
    university: profile.university || "",
  });

  const [changes, setChanges] = useState({});

  useEffect(() => {
    // Initialize formData with profile data
    setFormData({
      idaccount: profile.idaccount,
      fullname: profile.fullname || "",
      dob: profile.dob ? new Date(profile.dob) : null,
      sex: profile.sex || "",
      phone: profile.phone || "",
      address: profile.hometown || "",
      idcard: profile.idcard || "",
      university: profile.university || "",
    });
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      dob: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare updatedChanges with the entire formData
    const updatedChanges = { ...formData };

    // Update state with the current changes
    setChanges(updatedChanges);
    try {
      // Send the updatedChanges to your API
      const response = await updateProfile(updatedChanges);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form className="settingpage-account" onSubmit={handleSubmit}>
      <div className="settingpage-account-header">
        <h1 className="settingpage-account-title">Account</h1>
        <div className="settingpage-btn-container">
          <button type="button" className="settingpage-btn-cancel">
            Cancel
          </button>
          <button type="submit" className="settingpage-btn-save">
            <span>Save</span>
          </button>
        </div>
      </div>
      <div className="settingpage-account-edit">
        <div className="settingpage-input-container">
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            placeholder="full name"
          />
        </div>
        <div className="settingpage-input-container">
          <label>DOB</label>
          <DatePicker
            selected={formData.dob}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            showYearDropdown
            scrollableYearDropdown
          />
        </div>
      </div>
      <div className="settingpage-account-edit">
        <div className="settingpage-input-container">
          <label>Gender</label>
          <select name="sex" value={formData.sex} onChange={handleInputChange}>
            <option value="">select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unspecified">Unspecified</option>
          </select>
        </div>
        <div className="settingpage-input-container">
          <label>Phone number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="phone number"
          />
        </div>
      </div>
      <div className="settingpage-account-edit">
      <div className="settingpage-input-container">
          <label>University</label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleInputChange}
            placeholder="university"
          />
        </div>
        <div className="settingpage-input-container">
          <label>Personal ID</label>
          <input
            type="text"
            name="idcard"
            value={formData.idcard}
            onChange={handleInputChange}
            placeholder="personal ID"
          />
        </div>
      </div>
      <div className="settingpage-account-edit">
        <div className="settingpage-input-container">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
          ></textarea>
        </div>
      </div>
    </form>
  );
}

function Notification() {
  const [notifications, setNotifications] = useState({
    importantAnnouncementsEmail: true,
    importantAnnouncementsSite: false,
    featureAnnouncementsEmail: true,
    featureAnnouncementsSite: false,
    awardNotificationEmail: true,
    awardNotificationSite: true,
    newFollowersEmail: false,
    newFollowersSite: false,
    newParticipantsEmail: false,
    newParticipantsSite: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };
  const [isCheckedFollowedEvent, setIsCheckedFollowedEvent] = useState(false);
  const [isCheckedJoinedEvent, setIsCheckedJoinedEvent] = useState(false);
  const [isCheckedComingEvent, setIsCheckedComingEvent] = useState(false);
  const [isCheckedNewFollowers, setIsCheckedNewFollowers] = useState(false);
  const [isCheckedNewParticipants, setIsCheckedNewParticipants] = useState(false);

  return (
    <div className="settingpage-account">
      <div className="settingpage-account-header">
        <h1 className="settingpage-account-title">Notifications</h1>
      </div>
      <div className="settingpage-notification-content">
        <div className="settingpage-notification-section">
          <div className="settingpage-notification-item">
            <label htmlFor = "received-update-followed-event">
              <svg
                className={`settingpage__checkbox ${
                  isCheckedFollowedEvent ? "settingpage__checked--active" : ""
                }`}
                aria-hidden="true"
                viewBox="0 0 15 11"
                fill="none"
              >
                <path
                  d="M1 4.5L5 9L14 1"
                  strokeWidth="2"
                  stroke={isCheckedFollowedEvent ? "#fff" : "none"}
                />
              </svg>
              <input
                type="checkbox"
                id="received-update-followed-event"
                name="received-update-followed-event"
                checked={isCheckedFollowedEvent}
                onChange={() => setIsCheckedFollowedEvent(!isCheckedFollowedEvent)}
              />
            </label>
            <p>Receive updates on followed events</p>
          </div>
          <div className="settingpage-notification-item">
            <label htmlFor = "received-update-joined-event">
                <svg
                  className={`settingpage__checkbox ${
                    isCheckedJoinedEvent ? "settingpage__checked--active" : ""
                  }`}
                  aria-hidden="true"
                  viewBox="0 0 15 11"
                  fill="none"
                >
                  <path
                    d="M1 4.5L5 9L14 1"
                    strokeWidth="2"
                    stroke={isCheckedJoinedEvent ? "#fff" : "none"}
                  />
                </svg>
                <input
                  type="checkbox"
                  id="received-update-joined-event"
                  name="received-update-joined-event"
                  checked={isCheckedJoinedEvent}
                  onChange={() => setIsCheckedJoinedEvent(!isCheckedJoinedEvent)}
                />
              </label>
              <p>Receive updates on joined events</p>
          </div>
          <div className="settingpage-notification-item">
            <label htmlFor = "received-update-coming-event">
                  <svg
                    className={`settingpage__checkbox ${
                      isCheckedComingEvent ? "settingpage__checked--active" : ""
                    }`}
                    aria-hidden="true"
                    viewBox="0 0 15 11"
                    fill="none"
                  >
                    <path
                      d="M1 4.5L5 9L14 1"
                      strokeWidth="2"
                      stroke={isCheckedComingEvent ? "#fff" : "none"}
                    />
                  </svg>
                  <input
                    type="checkbox"
                    id="received-update-coming-event"
                    name="received-update-coming-event"
                    checked={isCheckedComingEvent}
                    onChange={() => setIsCheckedComingEvent(!isCheckedComingEvent)}
                  />
            </label>
            <p>Receive reminders about coming events</p>
          </div>
          <div className="settingpage-notification-item">
            <label htmlFor = "received-update-new-followers">
                    <svg
                      className={`settingpage__checkbox ${
                        isCheckedNewFollowers ? "settingpage__checked--active" : ""
                      }`}
                      aria-hidden="true"
                      viewBox="0 0 15 11"
                      fill="none"
                    >
                      <path
                        d="M1 4.5L5 9L14 1"
                        strokeWidth="2"
                        stroke={isCheckedNewFollowers ? "#fff" : "none"}
                      />
                    </svg>
                    <input
                      type="checkbox"
                      id="received-update-new-followers"
                      name="received-update-new-followers"
                      checked={isCheckedNewFollowers}
                      onChange={() => setIsCheckedNewFollowers(!isCheckedNewFollowers)}
                    />
              </label>
              <p>Receive updates on new followers</p>
          </div>
          <div className="settingpage-notification-item">
          <label htmlFor = "received-update-new-participants">
                    <svg
                      className={`settingpage__checkbox ${
                        isCheckedNewParticipants ? "settingpage__checked--active" : ""
                      }`}
                      aria-hidden="true"
                      viewBox="0 0 15 11"
                      fill="none"
                    >
                      <path
                        d="M1 4.5L5 9L14 1"
                        strokeWidth="2"
                        stroke={isCheckedNewParticipants ? "#fff" : "none"}
                      />
                    </svg>
                    <input
                      type="checkbox"
                      id="received-update-new-participants"
                      name="received-update-new-participants"
                      checked={isCheckedNewParticipants}
                      onChange={() => setIsCheckedNewParticipants(!isCheckedNewParticipants)}
                    />
              </label>
            <p>Receive updates on new participants</p>
            <input
              type="checkbox"
              name="newParticipantsEmail"
              checked={notifications.newParticipantsEmail}
              onChange={handleCheckboxChange}
            />
            <input
              type="checkbox"
              name="newParticipantsSite"
              checked={notifications.newParticipantsSite}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Setting() {
  const [language, setLanguage] = useState("en");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleTogglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    setError("");
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") setOldPassword(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const changePassword =async  () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
    } else {
      setError("");
      const profileID = localStorage.getItem("UserID");
      const data = { profileID, oldPassword, newPassword };
      const response = await ChangePassword(data);
      if (response.success){
      window.location.reload();}
    }
  };

  return (
    <div className="settingpage-account">
      <div className="settingpage-account-header">
        <h1 className="settingpage-account-title">General</h1>
      </div>
      <div className="settingpage-setting-content">
        <div className="settingpage-setting-item">
          <label className="settingpage-setting-label">Change password:</label>
          <button
            className="settingpage-button"
            onClick={handleTogglePasswordFields}
          >
            <span>Change</span>
          </button>
        </div>
        {showPasswordFields && (
          <div className="password-fields">
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={handlePasswordChange}
              placeholder="Old Password"
              className="settingpage-input"
            />
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="settingpage-input"
            />
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              className="settingpage-input"
            />
            {error && <p className="error-message">{error}</p>}
            <button className="settingpage-button" onClick={changePassword}>
              Confirm
            </button>
          </div>
        )}
        <div className="settingpage-setting-item">
          <label className="settingpage-setting-label">Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="settingpage-select"
          >
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
          </select>
        </div>
        <div className="settingpage-setting-item">
          <label className="settingpage-setting-label">Delete account:</label>
          <button className="settingpage-button delete">
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Logout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="settingpage-account">
      <div className="settingpage-account-header">
        <h1 className="settingpage-account-title">Log out</h1>
      </div>
      <div className="settingpage-logout-content">
        <h2 className="settingpage-account-question">
          Do you want to log out?
        </h2>
        <button className="settingpage-account-button" onClick={handleLogout}>
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
function Main() {
  const navigate = useNavigate();

  // Redirect to the main page when this component renders
  useEffect(() => {
    navigate("/mainpage");
  }, [navigate]);
  return null; // This component does not render anything
}
function ProfileSetting() {
  const [activeSection, setActiveSection] = useState("Account");
  const [url, setUrl] = useState(
    "https://cdn-icons-png.flaticon.com/512/3682/3682281.png"
  );
  const [profile, setProfile] = useState({
    idaccount: { username: "user", email: "email" },
  });
  const [loading, setLoading] = useState(false);
  const idaccount = localStorage.getItem("UserID");
  useEffect(() => {
    const getPrf = async () => {
      const response = await renderProfile({ idaccount });
      if (response.success) {
        setUrl(response.data.avatar);
        setProfile(response.data);
      }
      setLoading(true);
    };
    getPrf();
  }, []);
  const renderSection = () => {
    switch (activeSection) {
      case "Account":
        return <Account profile={profile} />;
      case "Notification":
        return <Notification />;
      case "Setting":
        return <Setting />;
      case "Logout":
        return <Logout />;
      case "Main":
        return <Main />;
      default:
        return <Account />;
    }
  };

  return (
    loading && (
      <div className="settingpage-container">
        <Navbar className="settingpage_navbar" />
        <div className="settingpage-profile">
          <div className="settingpage-profile-header">
            <ProfileImage initialUrl={url} />
            <div className="settingpage-profile-text-container">
              <h1 className="settingpage-profile-title">
                {profile.idaccount.username}
              </h1>
              <p className="settingpage-profile-email">
                {profile.idaccount.email}
              </p>
            </div>
          </div>
          <div className="settingpage-menu">
            <a
              className={`settingpage-menu-link ${
                activeSection === "Account" ? "settingpage-active" : ""
              }`}
              onClick={() => setActiveSection("Account")}
            >
              <i className="fa-solid fa-circle-user settingpage-menu-icon"></i>
              Account
            </a>
            <a
              className={`settingpage-menu-link ${
                activeSection === "Notification" ? "settingpage-active" : ""
              }`}
              onClick={() => setActiveSection("Notification")}
            >
              <i className="fa-solid fa-bell settingpage-menu-icon"></i>
              Notification
            </a>
            <a
              className={`settingpage-menu-link ${
                activeSection === "Setting" ? "settingpage-active" : ""
              }`}
              onClick={() => setActiveSection("Setting")}
            >
              <i className="fa-solid fa-gear settingpage-menu-icon"></i>
              General
            </a>
            <a
              className={`settingpage-menu-link ${
                activeSection === "Logout" ? "settingpage-active" : ""
              }`}
              onClick={() => setActiveSection("Logout")}
            >
              <i className="fa-solid fa-right-from-bracket settingpage-menu-icon"></i>
              Logout
            </a>
            <a
              className={`settingpage-menu-link ${
                activeSection === "Main" ? "settingpage-active" : ""
              }`}
              onClick={() => setActiveSection("Main")}
            >
              <i className="fa-solid fa-circle-user settingpage-menu-icon"></i>
              Back to Home
            </a>
          </div>
        </div>
        {renderSection()}
      </div>
    )
  );
}

export default ProfileSetting;
