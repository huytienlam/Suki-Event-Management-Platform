import CEventModel from "../Models/CEventModel.js";
import ProfileModel from "../Models/ProfileModel.js";
import NotificationModel from "../Models/NotificationModel.js";
import OrderTicketModel from "../Models/OrderTicketModel.js";
import mongoose from "mongoose";
import fs from "fs";
// Lấy kết nối Mongoose hiện tại
const conn = mongoose.connection;

// Khai báo biến để lưu đối tượng GridFSBucket
let gfs;

// Thiết lập GridFSBucket khi kết nối Mongoose mở thành công
conn.once("open", () => {
  // Khởi tạo đối tượng GridFSBucket với tên bucket 'uploads'
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

const CEvent = async (req, res) => {
  try {
    const {
      eventname,
      profileId,
      eventtype,
      descriptionevent,
      rulesevent,
      location,
      eventdate,
      eventtime,
      numberoftickets,
      ticketavailable,
      participants,
      tickettype,
      price,
    } = req.body;
    const eventDate = new Date(eventdate);
    const logoevent = req.file; // Access the uploaded file

    const logoevent2 = logoevent
      ? {
          filename: logoevent.filename,
          contentType: logoevent.mimetype,
          size: logoevent.size,
          uploadDate: new Date(),
          imageBase64: fs.readFileSync(logoevent.path, "base64"),
        }
      : null;

    const numberoftickets2 = parseInt(ticketavailable, 10);
    const price2 = parseInt(price, 10);

    if (!logoevent2) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Kiểm tra và chuyển đổi ownerId thành ObjectId
    if (!mongoose.isValidObjectId(profileId)) {
      return res.status(400).send("Invalid owner ID");
    }

    const ownerObjectId = new mongoose.Types.ObjectId(profileId);

    // Tạo mới sự kiện
    const newEvent = await CEventModel.create({
      profile: ownerObjectId,
      logoevent: logoevent2,
      eventname: eventname,
      eventtype: eventtype,
      descriptionevent: descriptionevent,
      rulesevent: rulesevent,
      location: location,
      eventdate: eventDate,
      eventtime: eventtime,
      numberoftickets: numberoftickets,
      ticketavailable: numberoftickets2,
      tickettype: tickettype,
      participants: participants,
      price: price2,
      participants_id: [],
      status: "Pending",
    });
    const notification = await NotificationModel.findOne({
      profileID: ownerObjectId,
    });
    notification.Noti.push({
      content: `Your event ${eventname} is now pending approval.`,
      Date_Noti: new Date(),
    });
    await notification.save();
    res.json({ success: true, message: "Create event sucessfully" });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const Renderdata = async (req, res) => {
  const { eventID } = req.body;

  try {
    // Find the event by its ID
    const findEvent = await CEventModel.findOne({ _id: eventID }).exec();

    // Check if the event was not found
    if (!findEvent) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong event ID" });
    } else {
      // Format the event data
      const eventsData = {
        ...findEvent.toObject()
      };

      // Send the formatted event data in the response
      return res.status(200).json({ success: true, data: eventsData });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const RenderEvent = async (req, res) => {
  const { eventID, profile } = req.body;
  try {
    const findEvent = await CEventModel.findOne({ _id: eventID }).exec();
    if (!findEvent) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event id!" });
    } else {
      const isOrga = profile == findEvent.profile;
      const follow = findEvent.follows.includes(profile);
      res.json({
        success: true,
        data: findEvent,
        isOrga: isOrga,
        follow: follow,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const SearchEvent = async (req, res) => {
  try {
    const events = await CEventModel.find(
      { status: "Approved" },
      {
        _id: 1,
        logoevent: 1,
        eventname: 1,
        eventtype: 1,
        location: 1,
        eventdate: 1,
        descriptionevent: 1,
        eventtime: 1,
      }
    );
    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const FollowEvent = async (req, res) => {
  try {
    const { eventID, profile } = req.body;
    const findEvent = await CEventModel.findOne({ _id: eventID }).exec();
    if (!findEvent) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event id!" });
    } else {
      if (findEvent.follows.includes(profile)) {
        findEvent.follows = findEvent.follows.filter(
          (item) => !item.equals(profile)
        );
      } else {
        findEvent.follows.push(profile);
      }
      await findEvent.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const JoinEvent = async (req, res) => {
  try {
    const { eventID, profile } = req.body;
    const findEvent = await CEventModel.findOne({ _id: eventID }).exec();
    if (!findEvent) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event id!" });
    } else {
      if (findEvent.participants_id.includes(profile)) {
        findEvent.participants_id = findEvent.participants_id.filter(
          (item) => !item.equals(profile)
        );
      } else {
        findEvent.participants_id.push(profile);
      }
      await findEvent.save();
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const RenderEventMP = async (req, res) => {
  const { profile } = req.body;
  try {
    const events = await CEventModel.find(
      { status: "Approved" },
      {
        _id: 1,
        profile: 1,
        logoevent: 1,
        eventname: 1,
        eventtype: 1,
        participants_id: 1,
        follows: 1,
      }
    );
    const event_follow = events.filter((event) =>
      event.follows.includes(profile)
    );
    const event_orga = events.filter((event) => event.profile == profile);
    res.json({
      success: true,
      event_follow: event_follow,
      event_orga: event_orga,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const AdminRenderEvent = async (req, res) => {
  try {
    const events = await CEventModel.find(
      {},
      {
        _id: 1,
        eventname: 1,
        eventtype: 1,
        status: 1,
        eventcreationdate: 1,
      }
    )
      .populate("profile", "fullname avatar")
      .exec();
    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const AdminApproveEvent = async (req, res) => {
  const { eventID, status } = req.body;
  try {
    const findEvent = await CEventModel.findOne({ _id: eventID }).exec();
    if (!findEvent) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event id!" });
    } else {
      findEvent.status = status;
      await findEvent.save();
    }
    if (status == "Approved") {
      const notification = await NotificationModel.findOne({
        profileID: findEvent.profile,
      });
      notification.Noti.push({
        content: `Your event ${findEvent.eventname} has been approved.`,
        Date_Noti: new Date(),
      });
      await notification.save();
    } else {
      const notification = await NotificationModel.findOne({
        profileID: findEvent.profile,
      });
      notification.Noti.push({
        content: `Your event ${findEvent.eventname} has been rejected.`,
        Date_Noti: new Date(),
      });
      await notification.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const Followers = async (req, res) => {
  try {
    const {eventID} = req.body;
    const event = await CEventModel.findOne({_id: eventID}).exec();
    const followers = await Promise.all(event.follows.map(async (profileID) => {
      const profile = await ProfileModel.findOne({ _id: profileID }).populate('idaccount', 'email').exec();
      return {
        fullname: profile.fullname,
        avatar: profile.avatar,
        email: profile.idaccount.email,
      };
    }));
    if (event.eventtype === "Music" || event.eventtype === "Festival") {
      const tickets = await OrderTicketModel.find({ eventID: eventID }).populate('profileID').exec();
      const tickets2 = await Promise.all(
        tickets.map(async (ticket) => {
          const profile = await ProfileModel.findOne({ _id: ticket.profileID })
            .populate('idaccount', 'email')
            .exec();
          return {
            fullname: profile.fullname,
            email: profile.idaccount.email,
            ticketorder: ticket.ticketorder,
          };
        })
      );
      
      res.json({ success: true, followers: followers, data: tickets2 });
    }
    else {
      const participants = await Promise.all(event.participants_id.map(async (profileID) => {
        const profile = await ProfileModel.findOne({ _id: profileID }).populate('idaccount', 'email').exec();
        return {
          fullname: profile.fullname,
          avatar: profile.avatar,
          email: profile.idaccount.email,
        };
      }));
      res.json({ success: true, followers: followers, data: participants });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const CancelEvent = async (req, res) => {
  try {
    const { eventID } = req.body;
    const event = await CEventModel.findOne({ _id: eventID }).exec();
    if (!event) {
      return res.status(400).json({ success: false, message: "Invalid event id!" });
    }
    event.status = "Cancelled";
    await event.save();
    res.status(200).json({ success: true });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const EditEvent = async (req, res) => {
  try {
    const {description, date, rule, time, location, eventID, profileID} = req.body;
    const event = await CEventModel.findOne({ _id: eventID}).exec();
    if (!event) {
      return res.status(400).json({ success: false, message: "Invalid event id!" });
    }
    event.descriptionevent = description;
    event.eventdate = date;
    event.rulesevent = rule;
    event.eventtime = time;
    event.location = location;
    event.status = "Pending";

    await event.save();
    const notification = await NotificationModel.findOne({
      profileID: profileID,
    });
    notification.Noti.push({
      content: `Your event ${event.eventname} has been successfully updated and is now pending approval.`,
      Date_Noti: new Date(),
    });
    await notification.save();
    res.status(200).json({ success: true });
  }  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const CEventController = {
  CEvent: CEvent,
  Renderdata: Renderdata,
  RenderEvent: RenderEvent,
  SearchEvent: SearchEvent,
  FollowEvent: FollowEvent,
  JoinEvent: JoinEvent,
  RenderEventMP: RenderEventMP,
  AdminRenderEvent: AdminRenderEvent,
  AdminApproveEvent: AdminApproveEvent,
  Followers: Followers,
  CancelEvent: CancelEvent,
  EditEvent: EditEvent,
};

export default CEventController;
