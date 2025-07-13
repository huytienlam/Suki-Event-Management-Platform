import mongoose from "mongoose";

const { Schema } = mongoose;

const CommentSchema = new Schema({
  comment: { type: String, required: true },
  profileID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoProfile",
    required: true,
  },
});

const InteractionSchema = new Schema({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoPost",
    required: true,
  },
  profileIDs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InfoProfile",
      required: true,
    },
  ],
  comments: [CommentSchema], // Sửa đổi để lưu nhiều comment
});

const InteractionModel = mongoose.model("InfoInteraction", InteractionSchema);

export default InteractionModel;
