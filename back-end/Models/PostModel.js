import mongoose from "mongoose";

const { Schema } = mongoose;

const imagepostSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  size: Number,
  uploadDate: Date,
  imageBase64: String,
});

const PostSchema = new Schema({
  eventID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoCEvent",
    required: true,
  },
  postcreationdate: { type: Date, default: Date.now },
  descriptionpost: { type: String },
  images: { type: [imagepostSchema] },
});

PostSchema.pre("save", function (next) {
  if (!this.postcreationdate) {
    this.postcreationdate = new Date();
  }
  next();
});

const PostModel = mongoose.model("InfoPost", PostSchema);

export default PostModel;
