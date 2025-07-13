import React, { useState, useEffect, useRef } from "react";
import Event from "../assets/Event.png";
import Post from "../components/Post";
import NavBar from "../components/NavBar";
import "../assets/EventPage.css";
import MyPostWidget from "../components/DropZone";
import { useLocation, useNavigate } from "react-router-dom";
import {
  renderEvent,
  renderEventPost,
  followEvent,
  OrderTicket,
  CancelTicket,
  StatusOrder,
  JoinEvent,
} from "../API";

function EventPage() {
  const navigate = useNavigate();
  const [infoEvent, setInfoEvent] = useState({});
  const [posts, setPosts] = useState([]);
  const [joinBackground, setJoinBackGround] = useState("#2d158f");
  const [joinText, setJoinedText] = useState("Join Event");

  const [showDropdown, setShowDropdown] = useState(false);
  const [showCancelDropdown, setShowCancelDropdown] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút
  const [disabledBooking, setIsButtonDisabled] = useState(true);
  const [buttonText, setButtonText] = useState("Buy Ticket");
  const [buttonColor, setButtonColor] = useState("#ff7383");
  const [numFollow, setNumFollow] = useState(0);
  const [numTicket, setNumTicket] = useState(0);
  const [numParticipant, setNumParticipant] = useState(0);
  const [followedText, setFollowedText] = useState("Follow");
  const [followButtonBackGround, setFollowButtonBackGround] =
    useState("ff7383");
  const leftColRef = useRef(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [ticket, setTicket] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventID = queryParams.get("id")?.toLowerCase() || "";
  const profile = localStorage.getItem("ProfileID");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [loading, setLoading] = useState(true);
  localStorage.setItem("eventid", eventID);
  const bgImage = Event
  const handleJoin = async () => {
    const response = await JoinEvent({ eventID, profile });
    if (response.success) {
      if (joinText === "Join Event") {
        setJoinedText("Cancel Participation");
        setJoinBackGround("linear-gradient(150deg, #2d158f, #ff7383)");
        setNumParticipant(numParticipant - 1);
      } else {
        setJoinedText("Join Event");
        setJoinBackGround("#2d158f");
        setNumParticipant(numParticipant + 1);
      }
    }
  };
  const handleFollowedText = async () => {
    const response = await followEvent({ eventID, profile });
    if (followedText === "Follow") {
      setFollowedText("Unfollow");
      setFollowButtonBackGround("linear-gradient(150deg, #2d158f, #ff7383)");
      setNumFollow(numFollow + 1);
    } else {
      setFollowedText("Follow");
      setFollowButtonBackGround("#ff7383");
      setNumFollow(numFollow - 1);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await renderEvent({ eventID, profile });
        if (response.success) {
          // Cập nhật trạng thái với dữ liệu sự kiện
          setInfoEvent(response.data);
          setIsOrganizer(response.isOrga);
          setNumFollow(response.data.follows.length);
          setNumTicket(response.data.ticketavailable);
          setNumParticipant(
            response.data.participants - response.data.participants_id.length
          );
          if (response.data.participants_id.includes(profile)) {
            setJoinedText("Cancel Participation");
            setJoinBackGround("linear-gradient(150deg, #2d158f, #ff7383)");
          }
          // Thực hiện các logic liên quan đến infoEvent
          if (
            response.data.eventtype === "Music" ||
            response.data.eventtype === "Festival"
          ) {
            setTicket(true);
            const status = await StatusOrder({ eventID, profile });
            if (status.success) {
              if (status.status) {
                setButtonColor("linear-gradient(150deg, #2d158f, #ff7383)");
                setButtonText("Cancel Tickets");
              }
            }
          }
          if (response.follow) {
            setFollowedText("Unfollow");
            setFollowButtonBackGround(
              "linear-gradient(150deg, #2d158f, #ff7383)"
            );
          }
          // Khi các trạng thái quan trọng đã được cập nhật, setLoading sẽ được gọi sau cùng
          setLoading(false);
        }

        const response2 = await renderEventPost({ eventID });
        if (response2.success) {
          setPosts(response2.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        const now = new Date();
        const targetDate = new Date(infoEvent.eventdate);

        // Tách giờ và phút từ time_start
        const [hours, minutes] = infoEvent.eventtime.split(':').map(Number);

        // Thêm giờ và phút vào targetDate
        targetDate.setHours(hours);
        targetDate.setMinutes(minutes);
        targetDate.setSeconds(0);

        const difference = targetDate - now;

        if (difference <= 0) {
          clearInterval(interval);
          setTimeRemaining("Event is over");
        } else {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hoursRemaining = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutesRemaining = Math.floor((difference / (1000 * 60)) % 60);
          const secondsRemaining = Math.floor((difference / 1000) % 60);

          setTimeRemaining(
            `${days} days ${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s left!`
          );
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [infoEvent.eventdate, infoEvent.eventtime, loading]);


  const handleBooking = () => {
    if (buttonText === "Buy Ticket") {
      setShowDropdown(!showDropdown);
      setTimeLeft(300); // Reset timer when opening dropdown
    } else if (buttonText === "Cancel Tickets") {
      setShowCancelDropdown(!showCancelDropdown);
    }
  };
  const handleBookingTicket = async () => {
    if (amount > 0 && amount <= numTicket ) {
      const response = await OrderTicket({ profile, eventID, amount });
      if (response.success) {
        setShowDropdown(!showDropdown);
        setNumTicket(numTicket - amount);
        setButtonColor("linear-gradient(150deg, #2d158f, #ff7383)");
        setButtonText("Cancel Tickets");
      }
    }
    else {
      alert("Invalid amount");
    }
  };
  const handleCancel = async () => {
    if (buttonText === "Cancel Tickets") {
      const response = await CancelTicket({ eventID, profile });
      if (response.success) {
        console.log("Cancel complete\n");
        setNumTicket(numTicket + response.num_of_ticket);
        setButtonText("Buy Ticket"); // Reset button text
        setButtonColor("#ff7383"); // Reset button color
        setShowCancelDropdown(false); // Hide cancel dropdown if open}
      }
    }
  };
  const handleManageEvent = () => {
    navigate(`/event/manage?id=${eventID}`);
  }

  useEffect(() => {
    if (amount && isChecked) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [amount, isChecked]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (leftColRef.current) {
        if (entry.isIntersecting) {
          leftColRef.current.style.height = "auto";
        } else {
          leftColRef.current.style.height = `${window.innerHeight}px`;
        }
      }
    });

    if (leftColRef.current) {
      observer.observe(leftColRef.current);
    }

    return () => {
      if (leftColRef.current) {
        observer.unobserve(leftColRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showDropdown) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowDropdown(false); // Tự động đóng booking event khi hết thời gian
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showDropdown]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const headerStyle = {
    marginTop: "62px",
    width: "100%",
    background: `url(${bgImage}) no-repeat 50% 20% / cover`,
    minHeight: "calc(100px + 15vw)",
  };

  return (
    <div className="ticket-event-page__maincontainer">
      <NavBar />
      <div className="ticket-event-page__header__wrapper">
        <div style={headerStyle} />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="ticket-event-page__cols__container">
            <div className="ticket-event-page__left__col" ref={leftColRef}>
              <div className="ticket-event-page__layer">
                <div className="ticket-event-page__img__container">
                  <div className="ticket-event-page__round">
                    <img
                      src={
                        infoEvent.logoevent
                          ? `data:${infoEvent.logoevent.contentType};base64,${infoEvent.logoevent.imageBase64}`
                          : "#"
                      }
                      alt="User img"
                    />
                  </div>
                  <span></span>
                </div>
                <div className="ticket-event-page__name-container">
                  <h2>{infoEvent.eventname}</h2>
                </div>
                <div className="organizer-ticket-event-page__upper-part">
                  <div className="ticket-event-page__information-container">
                    <p>{infoEvent.descriptionevent}</p>
                  </div>
                  <div className="ticket-event-page__follow">
                    {isOrganizer ? (
                      <button
                        onClick={handleManageEvent}
                        style={{ background: followButtonBackGround }}
                      >
                        Manage
                      </button>
                    ) : (
                      <button
                        onClick={handleFollowedText}
                        style={{ background: followButtonBackGround }}
                      >
                        {followedText}
                      </button>
                    )}
                  </div>
                  <ul className="ticket-event-page__about">
                    <li>
                      <div>
                        <div>{numFollow}</div>
                        <div>Followers</div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div>{posts.length}</div>
                        <div>Posts</div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div>{ticket ? numTicket : numParticipant}</div>
                        <div>{ticket ? "Tickets left" : "Slots left"}</div>
                      </div>
                    </li>
                  </ul>
                  <ul className="ticket-event-page__remain-info">
                    <li>
                      <span>Date:</span>
                      {timeRemaining}
                    </li>
                    <li>
                      <span>Time:</span>This is data
                    </li>
                    <li>
                      <span>Category:</span>
                      {infoEvent.eventtype}
                    </li>
                    <li>
                      <span>Location:</span>
                      {infoEvent.location}
                    </li>
                  </ul>
                </div>
                <div className="ticket-event-page__rule-container">
                  <p>Rules</p>
                  {infoEvent.rulesevent}
                </div>
              </div>
            </div>
            <div className="ticket-event-page__right__col">
              <nav>
                <ul>
                  <li>
                    <a>Posts</a>
                  </li>
                </ul>
                {isOrganizer ? (
                  <div />
                ) : ticket ? (
                  <button
                    onClick={handleBooking}
                    className="booking-button"
                    style={{ background: buttonColor }}
                  >
                    {buttonText}
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    className="booking-button"
                    style={{ background: joinBackground }}
                  >
                    {joinText}
                  </button>
                )}
                {showDropdown && (
                  <div
                    className="ticket-event-page__dropdown-menu"
                    onClick={handleBooking}
                  >
                    <div
                      className="ticket-event-page__dropdown-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="ticket-event-page__dropdown-input-wrapper">
                        <label
                          className="ticket-event-page__dropdown-label"
                          htmlFor="booking-amount"
                        >
                          Amount:
                        </label>
                        <input
                          type="number"
                          id="booking-amount"
                          placeholder="Booking Amount"
                          className="ticket-event-page__dropdown-input"
                          value={amount}
                          onChange={handleAmountChange}
                        />
                      </div>
                      <div className="ticket-event-page__dropdown-agreement">
                        <label htmlFor="agree">
                          <svg
                            className={`ticket-event-page__checkbox ${
                              isChecked
                                ? "ticket-event-page__checked--active"
                                : ""
                            }`}
                            aria-hidden="true"
                            viewBox="0 0 15 11"
                            fill="none"
                          >
                            <path
                              d="M1 4.5L5 9L14 1"
                              strokeWidth="2"
                              stroke={isChecked ? "#fff" : "none"}
                            />
                          </svg>
                          <input
                            type="checkbox"
                            id="agree"
                            name="agree"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                          />
                        </label>
                        <p>
                          I agree with the Terms and Conditions of the Suki
                          Event Management Platform and am responsible for the
                          information provided in this form.
                        </p>
                      </div>
                      <div className="ticket-event-page__dropdown-timer">
                        Time left: {formatTime(timeLeft)}
                      </div>
                      <button
                        onClick={handleBookingTicket}
                        disabled={disabledBooking}
                        className="ticket-event-page__dropdown-buy-button"
                      >
                        Buy Tickets
                      </button>
                    </div>
                  </div>
                )}
                {showCancelDropdown && (
                  <div
                    className="ticket-event-page__dropdown-menu"
                    onClick={() => {
                      setShowCancelDropdown(!showCancelDropdown);
                    }}
                  >
                    <div
                      className="ticket-event-page__dropdown-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p>Do you want to cancel tickets?</p>
                      <button
                        onClick={handleCancel}
                        className="ticket-event-page__dropdown-buy-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </nav>
              <div className="ticket-event-page__container-post">
                {isOrganizer ? <MyPostWidget picturePath={`data:${infoEvent.logoevent.contentType};base64,${infoEvent.logoevent.imageBase64}`}/> : <div></div>}
                {posts
                  .slice()
                  .reverse()
                  .map((post) => (
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
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventPage;
