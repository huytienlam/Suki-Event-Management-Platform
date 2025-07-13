import NotificationModel from "../Models/NotificationModel.js";

const GetNotification = async (req, res) => {
  try {
    const { profile } = req.body;
    const notification = await NotificationModel.findOne({
      profileID: profile,
    });
    if (!notification) {
      return res.status(200).json({ success: true, data: [] });
    } else {
      return res.status(200).json({ success: true, data: notification.Noti });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const AddNotification = async (req, res) => {
  try {
    const { profile, content } = req.body;
    const notification = await NotificationModel.findOne({
      profileID: profile,
    });
    if (!notification) {
      const newNotification = new NotificationModel({
        profileID: profile,
        Noti: [{ content: content }],
      });
      await newNotification.save();
    } else {
      notification.Noti.push({ content: content });
      await notification.save();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const NotificationController = {
  GetNotification: GetNotification,
  AddNotification: AddNotification,
};

export default NotificationController;
