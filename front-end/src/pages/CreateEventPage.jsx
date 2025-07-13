import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/CreateEventPage.css";
import SukiWhite from "../assets/Logo/SukiWhite.svg";
import { renderProfile, createEvent } from "../API";
import Ring1 from "../assets/Abstract Objects/Ellipse 9-1.svg";
import Ellipse1 from "../assets/Abstract Objects/Ellipse 7-3.svg";
import Polyline1 from "../assets/Abstract Objects/Vector 8.svg";
import Polygon1 from "../assets/Abstract Objects/Polygon 2.svg";

function AbstractFigures() {
  return (
    <div className="create-event__abstract-container">
      <div className="create-event__top-left-gradient" />
      <div className="create-event__bottom-right-gradient" />

      <img src={Ring1} className="create-event__ring-1" />
      <img src={Ellipse1} className="create-event__ellipse-1" />
      <img src={Polyline1} className="create-event__polyline-1" />
      <img src={Polygon1} className="create-event__polygon-1" />
    </div>
  );
}

function CreateEvent() {
  const navigate = useNavigate();
  const [url, setUrl] = useState(
    "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
  );
  const eventInputRef = useRef(null);
  const [eventImage, setEventImage] = useState(null);
  const [eventFile, setEventFile] = useState(null);
  const [category, setCategory] = useState("0");
  const [ticketType, setTicketType] = useState("0");
  const idaccount = localStorage.getItem("UserID");
  const [name, setName] = useState("user");
  const categories = [
    "Charity",
    "Meeting",
    "Team Building",
    "Music",
    "Festival",
  ];
  function isOver18(dob) {
    if (!dob) return false;
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear() - (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()));
    return age >= 18;
  }
  useEffect(() => {
    const getImg = async () => {
      const response = await renderProfile({ idaccount });
      if (response.success) {
        if (!isOver18(response.data.dob)) {
          alert("You are under 18 years old or have not updated your account information. Please update your details to proceed.");
          navigate("/mainpage");
        }
        localStorage.setItem("ProfileID", response.data._id);
        if (response.data.avatar) {
        setUrl(
          `data:${response.data.avatar.contentType};base64,${response.data.avatar.imageBase64}`
        );}
        if (response.data.fullname){
        setName(response.data.fullname);
        }
      }
    };
    getImg();
  }, [idaccount]);
  // const [isChecked, setIsChecked] = useState(false);
  const handleEventImageClick = () => {
    eventInputRef.current.click();
  };

  const handleEventImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEventFile(file);
      setEventImage(imageUrl);
      const imgContainer = document.getElementById(
        "create-event__img-container"
      );
      imgContainer.style.backgroundColor = "transparent"; // Set to transparent or any desired color
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll(
      "input[required], textarea[required]"
    );
    const submitButton = document.getElementById("create-event-button");
    const imgContainer = document.getElementById("create-event__img-container");

    const validateInput = (input) => {
      if (!input.value.trim()) {
        input.style.backgroundColor = "#db6b6b";
      } else {
        input.style.backgroundColor = "";
      }
    };

    const handleInputEvent = (input) => {
      validateInput(input);
    };
    inputs.forEach((input) => {
      input.addEventListener("input", () => handleInputEvent(input));
    });

    const validateForm = () => {
      let isValid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          input.style.backgroundColor = "#db6b6b";
          isValid = false;
        } else {
          input.style.backgroundColor = "";
        }
      });

      if (!eventImage) {
        imgContainer.style.backgroundColor = "#db6b6b";
        isValid = false;
      } else {
        imgContainer.style.backgroundColor = "";
      }

      return isValid;
    };

    const handleSubmit = (e) => {
      if (!validateForm()) {
        e.preventDefault();
      }
    };

    submitButton.addEventListener("click", handleSubmit);

    return () => {
      submitButton.removeEventListener("click", handleSubmit);
      inputs.forEach((input) => {
        input.removeEventListener("input", () => handleInputEvent(input));
      });
    };
  }, [eventImage]);

  const handleForm = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("logoevent", eventFile);
    formData.append("profileId", localStorage.getItem("ProfileID"));
    formData.append("eventname", event.target.elements["event-name"].value);
    formData.append("eventtype", categories[category]);
    formData.append(
      "descriptionevent",
      event.target.elements["description"].value
    );
    formData.append("rulesevent", event.target.elements["rules"].value || "");
    formData.append("location", event.target.elements["location"].value);
    formData.append("eventdate", event.target.elements["event-date"].value);
    formData.append("eventtime", event.target.elements["event-time"].value);
    formData.append(
      "numberoftickets",
      event.target.elements["ticket-quantity"].value || "0"
    );
    formData.append(
      "ticketavailable",
      event.target.elements["ticket-quantity"].value || "0"
    );
    formData.append(
      "participants",
      event.target.elements["participant"].value || "0"
    );
    formData.append("tickettype", ticketType);
    formData.append(
      "price",
      event.target.elements["ticket-price"].value || "0"
    );

    // Log form data
    const response = await createEvent(formData);
    if (response.success) {
      navigate("/mainpage");
    }
    // You can now send this formData to your API endpoint.
  };

  return (
    <>
      <div className="create-event__container">
        <AbstractFigures />

        <form className="create-event__form" onSubmit={handleForm}>
          <div className="create-event__header-bar">
            <div>
              <div className="create-event__profile-container">
                <img src={url} alt="profile" /> 
              </div>
              <p>
                Create Under <span>{name}</span>
              </p>
            </div>
            <div className="create-event__logo-container">
              <img src={SukiWhite} />
            </div>
          </div>
          <input
            required
            name="event-name"
            type="text"
            id="event-name"
            className="create-event__event-name"
            placeholder="Event Name"
            maxLength="50"
          />
          <div className="create-event__description-container">
            <label htmlFor="description">Description</label>
            <textarea
              maxLength="250"
              name="description"
              id="description"
              placeholder="250 word limit"
            />
          </div>
          <div className="create-event__rules-container">
            <label htmlFor="rules">Rules</label>
            <textarea
              maxLength="250"
              name="rules"
              id="rules"
              placeholder="(if any)"
            />
          </div>
          <div className="create-event__date-n-time-container">
            <p>Date & Time</p>
            <div>
              <input required name="event-date" type="date" id="event-date" />
              <input required name="event-time" type="time" id="event-time" />
            </div>
          </div>
          <div className="create-event__category-container">
            <label htmlFor="category">Category</label>
            <select
              name="event-type"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat, index) => (
                <option key={index} value={index.toString()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="create-event__location-container">
            <label htmlFor="location">Location</label>
            <input
              required
              name="location"
              type="text"
              id="location"
              className="create-event__location"
              placeholder="Detailed Location"
            />
          </div>

          <div className="create-event__participant-container">
            <label htmlFor="participant">Participants </label>
            <input
              disabled={category === "3" || category === "4"}
              name="participant"
              type="number"
              id="participant"
              className="create-event__participant"
              placeholder="Capacity"
              min={0}
              readOnly={category === "3" || category === "4"}
              style={{
                opacity: category === "3" || category === "4" ? "0.5" : "",
              }}
              required={
                category === "0" || category === "1" || category === "2"
              }
            />
          </div>
          <div className="create-event__ticket-container">
            <p>Tickets</p>
            <div>
              <input
                type="number"
                name="quantity"
                id="ticket-quantity"
                placeholder="Quantity"
                min={0}
                readOnly={
                  category === "0" || category === "1" || category === "2"
                }
                disabled={
                  category === "0" || category === "1" || category === "2"
                }
                style={{
                  opacity:
                    category === "0" || category === "1" || category === "2"
                      ? "0.5"
                      : "",
                }}
                required={category === "3" || category === "4"}
              />
              <select
                name="ticket-type"
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value)}
                readOnly={
                  category === "0" || category === "1" || category === "2"
                }
                disabled={
                  category === "0" || category === "1" || category === "2"
                }
                style={{
                  opacity:
                    category === "0" || category === "1" || category === "2"
                      ? "0.5"
                      : "",
                }}
              >
                <option value="0">Paid</option>
                <option value="1">Free</option>
                <option value="2">Donation</option>
              </select>
              <input
                type="number"
                name="ticket-price"
                id="ticket-price"
                placeholder="Price"
                min={0}
                readOnly={
                  category === "0" ||
                  category === "1" ||
                  category === "2" ||
                  ticketType === "1"
                }
                required={(category === "3" || category === "4") && ticketType !== "1"}
                style={{
                  opacity:
                    category === "0" ||
                    category === "1" ||
                    category === "2" ||
                    ticketType === "1"
                      ? "0.5"
                      : "",
                }}
              />
            </div>
          </div>
          <div className="create-event__logo">
            <div className="img-container" id="create-event__img-container">
              {eventImage ? <img src={eventImage} alt="Event" /> : <p></p>}
            </div>
            <input
              type="file"
              ref={eventInputRef}
              style={{ display: "none" }}
              onChange={handleEventImageChange}
              name="event-logo"
              required
            />
            <div className="create-event__upload-delete-container">
              <button
                className="upload"
                id="upload"
                type="button"
                onClick={handleEventImageClick}
              >
                Upload
              </button>
              <button
                className="delete"
                id="delete"
                type="button"
                onClick={() => setEventImage(null)}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="create-event__submit-container">
            <Link to="/mainpage" className="back-to-home__button">
              Back To Home
            </Link>
            <button
              type="submit"
              className="create-event__button"
              id="create-event-button"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateEvent;
