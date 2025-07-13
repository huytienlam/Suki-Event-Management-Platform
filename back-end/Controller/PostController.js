import PostModel from "../Models/PostModel.js";
import mongoose from "mongoose";
import fs from "fs";
const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

const UpPost = async (req, res) => {
  try {
    const eventID = req.body["eventID"];
    const descriptionpost = req.body["description"];
    const files = req.files;
    
    const images = files.map((file) => ({
      filename: file.filename,
      contentType: file.mimetype,
      size: file.size,
      uploadDate: new Date(),
      imageBase64: fs.readFileSync(file.path, "base64"),
    }));

    const eventObjectId = new mongoose.Types.ObjectId(eventID);

    // Tạo mới bài viết
    const newPost = new PostModel({
      eventID: eventObjectId,
      descriptionpost: descriptionpost,
      images: images,
    });
    await newPost.save();

    console.log("Post created successfully");
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const RenderPost = async (req, res) => {
  const { eventID } = req.body;

  try {
    const posts = await PostModel.find({ eventID: eventID })
      .populate("eventID", "logoevent eventname eventtype")
      .exec();
    if (posts.length === 0) {
      return res
        .status(200)
        .json({
          success: true,
          data: [],
          message: "No posts found for this event ID",
        });
    } else {
      const postsData = posts.map((post) => ({
        ...post.toObject(),
      }));
      res.json({ success: true, data: postsData });
    }
  } catch (error) {
    console.error("Error rendering posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const RenderMPPost = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("eventID", "logoevent eventname eventtype")
      .exec();

    if (posts.length === 0) {
      return res.json({ success: true, data: [] });
    } else {
      const postsData = posts.map((post) => ({
        ...post.toObject(),
      }));
      console.log("Send post data successfully!");

      res.json({ success: true, data: postsData });
    }
  } catch (error) {
    console.error("Error rendering posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const PostController = {
  UpPost: UpPost,
  RenderPost: RenderPost,
  RenderMPPost: RenderMPPost,
};

export default PostController;
