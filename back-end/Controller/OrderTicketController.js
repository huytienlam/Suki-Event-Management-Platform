import OrderTicketModel from "../Models/OrderTicketModel.js";
import CEventModel from "../Models/CEventModel.js";
import mongoose from "mongoose";

const OrderTicket = async (req, res) => {
  try {
    const { profile, eventID, amount } = req.body;

    const profileObjectId = new mongoose.Types.ObjectId(profile);
    const eventObjectId = new mongoose.Types.ObjectId(eventID);

    const newOrder = new OrderTicketModel({
      profileID: profileObjectId,
      eventID: eventObjectId,
      ticketorder: amount,
    });

    await newOrder.save();

    console.log("Order created successfully");

    const event = await CEventModel.findById(eventObjectId);
    if (event) {
      event.ticketavailable -= amount;
      await event.save();
      console.log("Event updated successfully");
    } else {
      console.error("Event not found");
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const CancelTicket = async (req, res) => {
  try {
    const { profile, eventID } = req.body;

    const order_ticket = await OrderTicketModel.findOneAndDelete({
      profileID: profile,
      eventID: eventID,
    });
    if (!order_ticket)
      res.status(400).json({ success: false, message: "Can not cancel" });
    else {
      const event = await CEventModel.findById(eventID);
      event.ticketavailable += order_ticket.ticketorder;
      await event.save();
      res.json({ success: true, num_of_ticket: order_ticket.ticketorder });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const StatusOrder = async (req, res) => {
  try {
    const { profile, eventID } = req.body;

    const order_ticket = await OrderTicketModel.findOne({
      profileID: profile,
      eventID: eventID,
    });
    if (!order_ticket) res.json({ success: true, status: false });
    else {
      res.json({ success: true, status: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const ProfileController = {
  OrderTicket: OrderTicket,
  CancelTicket: CancelTicket,
  StatusOrder: StatusOrder,
};

export default ProfileController;
