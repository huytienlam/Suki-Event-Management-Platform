import mongoose from "mongoose";

// Định nghĩa Schema cho logo sự kiện
const logoeventSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  size: Number,
  uploadDate: Date,
  imageBase64: String,
});

// Định nghĩa Schema cho sự kiện
const CEventSchema = new mongoose.Schema({
  eventID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoCEvent",
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoProfile",
    required: true,
  },
  logoevent: { type: logoeventSchema },
  eventname: { type: String, required: true },
  eventtype: { type: String, required: true },
  status: { type: String, required: true }, //add
  descriptionevent: { type: String },
  rulesevent: { type: String },
  location: { type: String, required: true },
  eventcreationdate: { type: Date, default: Date.now },
  eventdate: { type: Date, required: true, index: true },
  eventtime: { type: String, required: true },
  numberoftickets: { type: Number, required: true },
  ticketavailable: { type: Number, required: true },
  participants: { type: Number, required: true },
  tickettype: { type: String, required: true },
  price: { type: Number, required: true },
  follows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InfoProfile",
    },
  ],
  participants_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InfoProfile",
    },
  ],
});

// Middleware trước khi lưu
CEventSchema.pre("save", function (next) {
  if (!this.eventcreationdate) {
    this.eventcreationdate = new Date();
  }
  next();
});

// Tạo và xuất khẩu model
const CEventModel = mongoose.model("InfoCEvent", CEventSchema);

export default CEventModel;
