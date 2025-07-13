import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sukiLogo from "../assets/Logo/SukiWhite.svg";
import "../assets/AdminReview.css";
import { AdminApproveEvent, RenderDataEvent } from "../API";
import Ring1 from "../assets/Abstract Objects/Ellipse 9-1.svg";
import Ellipse1 from "../assets/Abstract Objects/Ellipse 7-3.svg";
import Polyline1 from "../assets/Abstract Objects/Vector 8.svg";
import Polygon1 from "../assets/Abstract Objects/Polygon 2.svg";

function AbstractFigures() {
  return (
    <div className="admin-review__abstract-container">
      <div className="admin-review__top-left-gradient" />
      <div className="admin-review__bottom-right-gradient" />

      <img src={Ring1} className="admin-review__ring-1" />
      <img src={Ellipse1} className="admin-review__ellipse-1" />
      <img src={Polyline1} className="admin-review__polyline-1" />
      <img src={Polygon1} className="admin-review__polygon-1" />
    </div>
  );
}

function AdminReview() {
  const [approveButtonText, setApproveButtonText] = useState("Approve Event");
  const [rejectButtonText, setRejectButtonText] = useState("Reject Event");
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [activeButton, setActiveButton] = useState(null); // Manage which button is active
  const [eventData, setEventData] = useState({});
  const queryParams = new URLSearchParams(location.search);
  const eventID = queryParams.get("id")?.toLowerCase() || "";
  const [image, setImage] = useState("#");
  useEffect(() => {
    // Fetch event data
    const fetchEventData = async () => {
      const response = await RenderDataEvent({ eventID });
      if (response.success) {
        response.data.eventdate = response.data.eventdate.split("T")[0];
        setEventData(response.data);
        setImage(
          `data:${response.data.logoevent.contentType};base64,${response.data.logoevent.imageBase64}`
        );
        console.log(response.data);
      }
    };
    fetchEventData();
  }, []);

  const handleApprove = async () => {
    const response = await AdminApproveEvent({ eventID, status: "Approved" });
    if (response.success) {
      setIsApproved(true);
      setApproveButtonText("Approved");
      setActiveButton("approve");
    }
  };
  const handleReject = async () => {
    const response = await AdminApproveEvent({ eventID, status: "Rejected" });
    if (response.success) {
      setIsRejected(true);
      setRejectButtonText("Rejected");
      setActiveButton("reject");
    }
  };

  return (
    <>
      <div className="admin-review__container">
        <AbstractFigures />

        <div className="admin-review__form">
          <div className="admin-review__header-bar">
            <div className="admin-review__logo-container">
              <img src={sukiLogo} />
            </div>
          </div>
          <div id="event-name" className="data-field">
            {eventData.eventname}
          </div>
          <div className="admin-review__description-container">
            <label htmlFor="description">Description</label>
            <div className="data-field">{eventData.descriptionevent}</div>
          </div>
          <div className="admin-review__rules-container">
            <label htmlFor="rules">Rules</label>
            <div className="data-field">{eventData.rulesevent}</div>
          </div>
          <div className="admin-review__date-n-time-container">
            <p>Date & Time</p>
            <div>
              <div className="data-field">{eventData.eventdate}</div>
              <div className="data-field">{eventData.eventtimeFormatted}</div>
            </div>
          </div>
          <div className="admin-review__category-container">
            <label htmlFor="category">Category</label>
            <div className="data-field">{eventData.eventtype}</div>
          </div>
          <div className="admin-review__location-container">
            <label htmlFor="location">Location</label>
            <div className="data-field">{eventData.location}</div>
          </div>
          <div className="admin-review__participant-container">
            <label htmlFor="participant">Participants</label>
            <div className="data-field">{eventData.participants}</div>
          </div>
          <div className="admin-review__ticket-container">
            <p>Tickets</p>
            <div>
              <div className="data-field">{eventData.ticketavailable}</div>
              <div className="data-field">{eventData.tickettype}</div>
              <div className="data-field">{eventData.price}</div>
            </div>
          </div>
          <div className="admin-review__logo">
            <div className="img-container" id="admin-review__img-container">
              {<img src={image} alt="Event" />}
            </div>
          </div>
          <div className="admin-review__comment-container">
            <label htmlFor="comment">Administrator Comments</label>
            <textarea
              maxLength="250"
              name="comment"
              id="comment"
              placeholder="if the administrators reject the event, they can show organizers why in this section, and how to make new one."
            />
          </div>
          <div className="admin-review__submit-container">
            <div>
              {activeButton !== "reject" && (
                <button
                  className="admin-review__approve"
                  type="button"
                  id="admin-review-approve"
                  onClick={handleApprove}
                  disabled={isApproved}
                >
                  {approveButtonText}
                </button>
              )}
              {isRejected && (
                <Link to="/admin">
                  <button className="admin-review__return-main" type="button">
                    Back To Home
                  </button>
                </Link>
              )}
            </div>
            <div>
              {activeButton !== "approve" && (
                <button
                  className="admin-review__reject"
                  type="button"
                  id="admin-review-reject"
                  onClick={handleReject}
                  disabled={isRejected}
                >
                  {rejectButtonText}
                </button>
              )}
              {isApproved && (
                <Link to="/admin">
                  <button className="admin-review__return-main" type="button">
                    Back To Home
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminReview;
