import mongoose from "mongoose";

const { Schema } = mongoose;

const NotiShema = new mongoose.Schema({
  content: { type: String },
  Date_Noti: { type: Date, default: Date.now },
});

const NotificationSchema = new Schema({
  profileID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoProfile",
    required: true,
  },
  Noti: { type: [NotiShema] },
});

const NotificationModel = mongoose.model(
  "InfoNotification",
  NotificationSchema
);

export default NotificationModel;
