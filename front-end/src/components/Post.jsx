import React, { useState, useEffect } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
import "../assets/Post.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getPostInteraction, commentPost, likePost } from "../API";

function Comment(props) {
  return (
    <div className="post__comment">
      <div className="post__comment-author-img">
        <img
          src={
            props.profileImg
              ? `data:${props.profileImg.contentType};base64,${props.profileImg.imageBase64}`
              : "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
          }
          alt="Profile img"
        />
      </div>
      <div className="post__comment_content">
        <div className="post__comment_content-user-name">
          {props.authorName == "" ? "Hidden User" : props.authorName}
        </div>
        <div className="post__comment_content-user-idea">
          {props.commentText}
        </div>
      </div>
    </div>
  );
}

function Overlay(props) {
  const [commentText, setCommentText] = useState("");
  useEffect(() => {
    if (props.isOpen) {
      document.body.classList.add("post__no-scroll");
    } else {
      document.body.classList.remove("post__no-scroll");
    }

    return () => {
      document.body.classList.remove("post__no-scroll");
    };
  }, [props.isOpen]);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSendComment = async () => {
    if (commentText.trim()) {
      const userID = localStorage.getItem("UserID");
      const response = await commentPost({
        postid: props.postID,
        profileid: userID,
        comment: commentText,
      });
      if (response.success) setCommentText(""); // Clear the input field after sending the comment

      // Reload interactions to get updated comments
      const updatedResponse = await getPostInteraction({
        postid: props.postID,
        userid: localStorage.getItem("ProfileID"),
      });
      if (updatedResponse.success) {
        props.updateComment(updatedResponse.data);
      }
    }
  };

  return (
    props.isOpen && (
      <div className="post__container-overlay" onClick={props.onClose}>
        <div className="post__overlay" onClick={(e) => e.stopPropagation()}>
          <div className="post__overlay-content">
            <h1>{props.eventName}'s Post</h1>
            <button className="post__close-button" onClick={props.onClose}>
              X
            </button>
          </div>
          <hr />
          <div className="post__comment-section">
            {props.comments.map((comment, index) => (
              <Comment
                key={index}
                profileImg={props.avatars[index]}
                authorName={props.fullnames[index]}
                commentText={comment}
              />
            ))}
          </div>
          <div className="post__user-comment">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={handleCommentChange}
            />
            <button
              className="post__send-button"
              onClick={handleSendComment}
              disabled={!commentText.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    )
  );
}

const PostCarousel = ({ images, setLiked, liked }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeart, setShowHeart] = useState(false);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDoubleClick = () => {
    setShowHeart(true);
    if (!liked) {
      setLiked(true); // Trigger the like action if not already liked
    }
    setTimeout(() => setShowHeart(false), 500);
  };

  return (
    images.length !== 0 && (
      <div className="post__post-img" onDoubleClick={handleDoubleClick}>
        {images.length > 0 && (
          <>
            <img
              src={`data:${images[currentIndex].contentType};base64,${images[currentIndex].imageBase64}`}
              alt="Post"
            />
            {images.length > 1 && (
              <div className="carousel-controls">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="control-button prev"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === images.length - 1}
                  className="control-button next"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
            {showHeart && (
              <AiFillHeart
                size={100}
                className={`heart-icon ${showHeart ? "show" : ""}`}
              />
            )}
          </>
        )}
      </div>
    )
  );
};

function Post(props) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [interaction, setInteraction] = useState({
    liked: false,
    num_likes: 0,
    comments: [],
    fullnames: [],
    avatars: [],
  });
  const [liked, setLiked] = useState(interaction.liked);
  const navigate = useNavigate();
  const movetoEvent = () => {
    localStorage.setItem("eventid", props.eventID);
    window.scrollTo(0, 0); // Scroll to top
    navigate(`/event?id=${props.eventID}`);
  };
  const handleCommentClick = () => {
    setShowOverlay(!showOverlay);
  };
  const calculateTimeLeft = (date) => {
    const targetDate = new Date(date);
    const now = new Date();
    const difference = now - targetDate;
    return Math.floor(difference / (1000 * 60 * 60));
  };

  const [hourAgo, setHourAgo] = useState(calculateTimeLeft(props.date));

  useEffect(() => {
    const timer = setInterval(() => {
      setHourAgo(calculateTimeLeft(props.date));
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(timer);
  }, [props.date]);

  const toggleLike = async () => {
    const response = await likePost({
      postid: props.postID,
      profileid: localStorage.getItem("ProfileID"),
    }); // Gọi API likePost

    if (response.success) {
      setLiked(!liked); // Thay đổi trạng thái liked
      setInteraction((prevInteraction) => ({
        ...prevInteraction,
        liked: !prevInteraction.liked,
        num_likes: prevInteraction.liked
          ? prevInteraction.num_likes - 1
          : prevInteraction.num_likes + 1,
      }));
    }
  };

  useEffect(() => {
    const fetchInteraction = async () => {
      try {
        const response = await getPostInteraction({
          postid: props.postID,
          userid: localStorage.getItem("ProfileID"),
        });
        if (response.success) {
          setInteraction(response.data);
          setLiked(response.data.liked); // Initialize the liked state based on the fetched data
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInteraction();
  }, [props.postID]);
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "499167776032088", // Replace with your Facebook app ID
        xfbml: true,
        version: "v15.0",
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);
  const shareLinkOnFacebook = (linkToShare) => {
    // Ensure the Facebook SDK is initialized
    if (typeof FB === "undefined") {
      console.error("Facebook SDK is not loaded.");
      return;
    }

    // Share the link using Facebook's Feed Dialog
    FB.ui(
      {
        method: "share",
        hashtag: "#SukiEvent",
        display: "popup",
        href: linkToShare, // Link to be shared
      },
      function (response) {
        // Handle the response here
        if (response && !response.error_message) {
          console.log("Link shared successfully.");
        } else {
          console.error(
            "Error while sharing the link:",
            response.error_message
          );
        }
      }
    );
  };

  const handleShareClick = () => {
    const linkToShare = `http://192.168.10.105:5173/event?id=${props.eventID}`;
    shareLinkOnFacebook(linkToShare);
  };
  return (
    <div className="post__post">
      <div className="post__post-author">
        <div className="post__post-author-img">
          <img
            onClick={movetoEvent}
            src={`data:${props.authorImg.contentType};base64,${props.authorImg.imageBase64}`}
            alt="Author"
          />
        </div>
        <div>
          <h1 onClick={movetoEvent}>{props.userName}</h1>
          <small>
            {hourAgo < 24
              ? `${hourAgo} hours ago`
              : hourAgo < 24 * 365
              ? `${Math.floor(hourAgo / 24)} days ago`
              : `${Math.floor(hourAgo / (24 * 365))} years ago`}
          </small>
        </div>
      </div>
      <p>{props.content}</p>
      <PostCarousel
        images={props.postImg}
        setLiked={toggleLike}
        liked={liked}
      />
      <div className="post__post-stats">
        <span>
          {interaction.num_likes} likes · {interaction.comments.length} comments
        </span>
      </div>
      <div className="post__post-activity">
        <div
          className="post__post-activity-link"
          onClick={toggleLike}
          style={{ cursor: "pointer" }}
        >
          {liked ? (
            <AiFillHeart size={27} style={{ fill: "red" }} className="beat" />
          ) : (
            <BiHeart size={27} style={{ color: "black" }} />
          )}
          <span> Like</span>
        </div>
        <div className="post__post-activity-link">
          <FaRegCommentDots size={17} onClick={handleCommentClick} />
          <span onClick={handleCommentClick}> Comment</span>
        </div>
        <div className="post__post-activity-link" onClick={handleShareClick}>
          <FaRegShareSquare size={17} />
          <span> Share</span>
        </div>
      </div>
      <Overlay
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
        profileImg={props.authorImg}
        comments={interaction.comments}
        fullnames={interaction.fullnames}
        avatars={interaction.avatars}
        postID={props.postID}
        eventName={props.userName}
        updateComment={setInteraction}
      />
    </div>
  );
}

export default Post;
