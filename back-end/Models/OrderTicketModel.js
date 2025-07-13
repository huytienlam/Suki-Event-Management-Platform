import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderTicketSchema = new Schema({
  profileID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoProfile",
    required: true,
  },
  eventID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InfoCEvent",
    required: true,
  },
  ticketorder: { type: Number, required: true },
});

const OrderTicketModel = mongoose.model("InfoOrderTicket", OrderTicketSchema);

export default OrderTicketModel;
