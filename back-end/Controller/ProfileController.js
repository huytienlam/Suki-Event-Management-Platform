import ProfileModel from "../Models/ProfileModel.js";
import NotificationModel from "../Models/NotificationModel.js";
import mongoose from "mongoose";
import fs from "fs";

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

const UpdateProfile = async (req, res) => {
  try {
    // Log the entire request body to verify its content

    // Correctly access fields from the request body
    const idaccount = req.body.idaccount._id;
    const fullname = req.body.fullname;
    const phone = req.body.phone; // Fixed typo here
    const dob = req.body.dob;
    const hometown = req.body.address;
    const sex = req.body.sex;
    const idcard = req.body.idcard;
    const university = req.body.university;
    // Find the profile and update or create as needed
    const profile = await ProfileModel.findOne({ idaccount }).exec();

    if (profile) {
      profile.fullname = fullname || profile.fullname;
      profile.phone = phone || profile.phone;
      profile.dob = dob ? new Date(dob) : profile.dob;
      profile.hometown = hometown || profile.hometown;
      profile.sex = sex || profile.sex;
      profile.idcard = idcard || profile.idcard;
      profile.university = university || profile.university;
      const notification = await NotificationModel.findOne({
        profileID: profile._id,
      });
      notification.Noti.push({
        content: `Your profile has been updated.`,
        Date_Noti: new Date(),
      });
      await profile.save();
      res
        .status(200)
        .json({ success: true, message: "Profile updated successfully" });
      console.log("Profile updated successfully");
    } else {
      const newProfile = new ProfileModel({
        idaccount,
        fullname,
        phone,
        dob: new Date(dob),
        hometown,
      });

      await newProfile.save();

      res
        .status(201)
        .json({ success: true, message: "Profile created successfully" });
      console.log("Profile created successfully");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const RenderProfile = async (req, res) => {
  const { idaccount } = req.body;
  try {
    // Tìm hồ sơ dựa trên ID tài khoản
    const profile = await ProfileModel.findOne({ idaccount: idaccount })
      .populate("idaccount", "username email")
      .exec();
    if (!profile) {
      return res
        .status(200)
        .json({ success: false, message: "Profile not found" });
    } else {
      const profileData = {
        ...profile.toObject(),
        dobFormatted: profile.dob
          ? new Date(profile.dob).toDateString()
          : "No date available",
      };

      res.json({ success: true, data: profileData });
    }
  } catch (error) {
    console.error("Error finding profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const ChangeAvatar = async (req, res) => {
  try {
    const idaccount = req.body.idaccount;
    const newImageFile = req.file; // Assuming you're using middleware like multer to handle file uploads

    const profile = await ProfileModel.findOne({ idaccount: idaccount }).exec();

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Create avatar object if newImageFile exists
    const avatar = newImageFile
      ? {
          filename: newImageFile.filename,
          contentType: newImageFile.mimetype,
          size: newImageFile.size,
          uploadDate: new Date(),
          imageBase64: fs.readFileSync(newImageFile.path, "base64"),
        }
      : null;

    // Update profile's avatar
    profile.avatar = avatar;

    // Save the updated profile
    await profile.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Avatar updated successfully",
        avatar: profile.avatar,
      });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const ProfileController = {
  UpdateProfile: UpdateProfile,
  RenderProfile: RenderProfile,
  ChangeAvatar: ChangeAvatar,
};

export default ProfileController;
