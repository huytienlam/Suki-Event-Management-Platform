import mongoose from "mongoose";

const { Schema } = mongoose;

const avtSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  size: Number,
  uploadDate: Date,
  imageBase64: String,
});

const ProfileSchema = new Schema({
  profileID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoProfile",
  },
  idaccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoAccount",
    required: true,
  },
  avatar: { type: avtSchema },
  fullname: { type: String },
  sex: { type: String },
  university: { type: String },
  phone: { type: String },
  idcard: { type: String },
  dob: { type: Date },
  hometown: { type: String },
});

const ProfileModel = mongoose.model("InfoProfile", ProfileSchema);

export default ProfileModel;
