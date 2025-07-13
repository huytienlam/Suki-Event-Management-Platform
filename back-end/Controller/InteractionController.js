import InteractionModel from "../Models/InteractionModel.js";
import InfoPostModel from "../Models/PostModel.js";
import ProfileModel from "../Models/ProfileModel.js";
import mongoose from "mongoose";

const commentPost = async (req, res) => {
  try {
    const { postid, profileid, comment } = req.body;
    // Tạo ObjectId từ postid và profileid
    const postObjectId = new mongoose.Types.ObjectId(postid);
    const profileObjectId = new mongoose.Types.ObjectId(profileid);
    // Tìm bài viết
    const post = await InfoPostModel.findById(postid);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Tìm hoặc tạo đối tượng Interaction
    let interaction = await InteractionModel.findOne({ postID: postObjectId });
    if (!interaction) {
      interaction = new InteractionModel({
        postID: postObjectId,
        profileIDs: [],
        comments: [],
      });
    }

    // Xử lý comment
    if (comment !== "") {
      interaction.comments.push({ profileID: profileObjectId, comment });
    }

    // Lưu thay đổi
    await interaction.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getPostInteraction = async (req, res) => {
  try {
    const { postid, userid } = req.body;
    const postObjectId = new mongoose.Types.ObjectId(postid);
    const userObjectId = new mongoose.Types.ObjectId(userid);

    // Find the interaction for the given post ID
    const interaction = await InteractionModel.findOne({
      postID: postObjectId,
    }).exec();
    if (!interaction) {
      return res.json({
        num_likes: 0,
        liked: false,
        comments: [],
        fullnames: [],
        avatars: [],
      });
    } else {
      const liked = interaction.profileIDs.includes(userObjectId);
      let fullnames = [];
      let avatars = [];
      let comments = [];
      for (let commentObj of interaction.comments) {
        const profile = await ProfileModel.findOne({
          idaccount: commentObj.profileID,
        }).exec();

        if (profile) {
          // Thêm fullname và avatar vào các mảng
          fullnames.push(profile.fullname);
          avatars.push(profile.avatar);
        }

        // Thêm comment text vào mảng
        comments.push(commentObj.comment);
      }
      const num_likes = interaction.profileIDs.length;
      console.log("send data success");
      res.json({
        success: true,
        data: {
          num_likes: num_likes,
          liked: liked,
          comments: comments,
          fullnames: fullnames,
          avatars: avatars,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const likePost = async (req, res) => {
  try {
    const { postid, profileid } = req.body;
    // Tạo ObjectId từ postid và profileid
    const postObjectId = new mongoose.Types.ObjectId(postid);
    const profileObjectId = new mongoose.Types.ObjectId(profileid);
    // Tìm bài viết
    const post = await InfoPostModel.findById(postid);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Tìm hoặc tạo đối tượng Interaction
    let interaction = await InteractionModel.findOne({ postID: postObjectId });
    if (!interaction) {
      interaction = new InteractionModel({
        postID: postObjectId,
        profileIDs: [],
        comments: [],
      });
      interaction.profileIDs.push(profileObjectId);
    } else {
      let liked = interaction.profileIDs.includes(profileObjectId);
      if (liked) {
        interaction.profileIDs = interaction.profileIDs.filter(
          (item) => !item.equals(profileObjectId)
        );
      } else {
        interaction.profileIDs.push(profileObjectId);
      }
    }

    // Lưu thay đổi
    await interaction.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const AdminDeleteComment = async (req, res) => {
  try {
    const { postid, userid } = req.body;
    const postObjectId = new mongoose.Types.ObjectId(postid);
    const userObjectId = new mongoose.Types.ObjectId(userid);

    // Find the interaction for the given post ID
    const interaction = await InteractionModel.findOne({
      postID: postObjectId,
    }).exec();
    if (!interaction) {
      return res.json({
        num_likes: 0,
        liked: false,
        comments: [],
        fullnames: [],
        avatars: [],
      });
    } else {
      const liked = interaction.profileIDs.includes(userObjectId);
      let fullnames = [];
      let avatars = [];
      let comments = [];
      for (let commentObj of interaction.comments) {
        const profile = await ProfileModel.findOne({
          idaccount: commentObj.profileID,
        }).exec();

        if (profile) {
          // Thêm fullname và avatar vào các mảng
          fullnames.push(profile.fullname);
          avatars.push(profile.avatar);
        }

        // Thêm comment text vào mảng
        comments.push(commentObj.comment);
      }
      const num_likes = interaction.profileIDs.length;
      console.log("send data success");
      res.json({
        success: true,
        data: {
          num_likes: num_likes,
          liked: liked,
          comments: comments,
          fullnames: fullnames,
          avatars: avatars,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const AdminListComment = async (req, res) => {
  try {
    // Find the interaction for the given post ID
    const interactions = await InteractionModel.find({}).exec();
    if (!interactions) {
      return res.json({
        success: true,
        comments: [],
        fullnames: [],
        avatars: [],
        postids: [],
      });
    } else {
      let fullnames = [];
      let avatars = [];
      let comments = [];
      let postids = [];
      for (let interaction of interactions) {
        for (let commentObj of interaction.comments) {
          const profile = await ProfileModel.findOne({
            idaccount: commentObj.profileID,
          }).exec();

          if (profile) {
            // Thêm fullname và avatar vào các mảng
            fullnames.push(profile.fullname);
            avatars.push(profile.avatar);
          }
          postids.push(interaction.postID);
          // Thêm comment text vào mảng
          comments.push(commentObj.comment);
        }
      }
      console.log("send data success");
      res.json({
        success: true,
        comments: comments,
        fullnames: fullnames,
        avatars: avatars,
        postids: postids,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const InteractionController = {
  commentPost: commentPost,
  likePost: likePost,
  getPostInteraction: getPostInteraction,
  AdminListComment: AdminListComment,
  AdminDeleteComment: AdminDeleteComment,
};

export default InteractionController;
