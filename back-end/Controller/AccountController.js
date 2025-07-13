import AccountModel from "../Models/AccountModel.js";
import ProfileModel from "../Models/ProfileModel.js";
import NotificationModel from "../Models/NotificationModel.js";
import OrderTicketModel from "../Models/OrderTicketModel.js"; //release2
import InteractionModel from "../Models/InteractionModel.js"; //release2
import CEventModel from "../Models/CEventModel.js"; //release2
import mongoose from "mongoose"; //release2
import sendMail from "../Email/SendEmail.js";
import bcrypt from "bcrypt";

const PostSignin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const account = await AccountModel.findOne({ username: username }).exec();

    if (account) {
      const match = await bcrypt.compare(password, account.password);
      if (match) {
        console.log("right password: " + account.username);
        res.json({
          success: true,
          username: account.username,
          userID: account._id,
        });
      }
      else {
        res.json({ success: false, message: "Wrong username or password" });
      }
    } else {
      res.json({ success: false, message: "Wrong username or password" });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

async function PostSignup(req, res) {
  const { username, password, email } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingEmail = await AccountModel.findOne({ email: email }).exec();
    if (existingEmail) {
      return res
        .status(200)
        .json({ success: false, message: "Email already in use" });
    }

    // Kiểm tra xem username đã tồn tại chưa
    const existingUsername = await AccountModel.findOne({
      username: username,
    }).exec();
    if (existingUsername) {
      return res
        .status(200)
        .json({ success: false, message: "Username already in use" });
    }

    // Nếu không có tài liệu trùng lặp, tạo tài liệu mới
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await AccountModel.create({
      username,
      password: hashedPassword,
      email,
    });
    const newProfile = await ProfileModel.create({
      idaccount: newAccount._id,
      avatar: null,
      fullname: "",
      sex: "",
      university: "",
      phone: "",
      idcard: "",
      dob: null,
      hometown: "",
    });
    const profileId = newProfile._id;

    const notificationContent = `Please complete your profile information.`;
    await NotificationModel.create({
      profileID: profileId,
      Noti: [
        {
          content: notificationContent,
          Date_Noti: new Date(),
        },
      ],
    });
    res.json({ success: true, message: "Sign up successfully" });
    console.log("Sign up Successfully!!!");
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ success: false, message: "An error occurred during signup" });
  }
}

async function PostForget_Pass(req, res) {
  const { email } = req.body;
  try {
    const findinfor = await AccountModel.findOne({ email: email }).exec();
    console.log(findinfor);
    if (!findinfor) {
      console.log("No user with that email");
      return res
        .status(400)
        .json({ success: false, message: "No user with that email" });
    } else {
      console.log("Already send email");
      res.json({ success: true, message: "Already send email" });
      await sendMail(findinfor.email);
    }
  } catch (err) {
    console.error("Error finding user:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

const DeleteAccount = async (req, res) => {
  try {
    const { profileID, password } = req.body;
    if (!profileID || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "ProfileID and password are required",
        });
    }

    if (!mongoose.isValidObjectId(profileID)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ProfileID" });
    }

    const profileInfo = await ProfileModel.findById(profileID);
    if (!profileInfo) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const account = await AccountModel.findById(profileInfo.idaccount);
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    const checkPassword = await bcrypt.compare(password, account.password);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    const checkOrganizer = await CEventModel.findOne({ profile: profileID });
    if (checkOrganizer) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Cannot delete profile because it is associated with an event",
        });
    }

    await CEventModel.updateMany(
      { follows: profileID },
      { $pull: { follows: profileID } }
    );

    await InteractionModel.updateMany(
      { profileIDs: profileID },
      { $pull: { profileIDs: profileID } }
    );
    await InteractionModel.updateMany(
      { "comments.profileID": profileID },
      { $pull: { comments: { profileID: profileID } } }
    );

    const orders = await OrderTicketModel.find({ profileID: profileID });
    for (const order of orders) {
      await CEventModel.findByIdAndUpdate(order.eventID, {
        $inc: { ticketavailable: order.ticketorder },
      });
    }
    await OrderTicketModel.deleteMany({ profileID: profileID });

    await AccountModel.findByIdAndDelete(profileInfo.idaccount);
    await ProfileModel.findByIdAndDelete(profileID);

    res
      .status(200)
      .json({ success: true, message: "Account successfully deleted" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { profileID, oldPassword, newPassword } = req.body;
    if (!profileID || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "ProfileID, old password and new password are required",
        });
    }

    if (!mongoose.isValidObjectId(profileID)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ProfileID" });
    }

    const account = await AccountModel.findById(profileID);
    if (!account) {
      
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    const checkPassword = await bcrypt.compare(oldPassword, account.password);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AccountModel.findByIdAndUpdate(account._id, { password: hashedPassword });

    res
      .status(200)
      .json({ success: true, message: "Password successfully changed" });
  }
  catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const AccountController = {
  PostSignin: PostSignin,
  PostSignup: PostSignup,
  PostForget_Pass: PostForget_Pass,
  DeleteAccount: DeleteAccount,
  ChangePassword: ChangePassword,
};
export default AccountController;
