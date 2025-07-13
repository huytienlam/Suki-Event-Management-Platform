import * as dotenv from "dotenv"; //add
import nodemailer from "nodemailer"; //add
import AccountModel from "../Models/AccountModel.js";
dotenv.config(); //add

//add sendmail
const sendMail = async (email) => {
  //console.log(process.env.USERNAME);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports

    auth: {
      user: "khavinhthuan114@gmail.com",
      pass: "wovfxklrkelbwyyt",
    },
  });
  const findinfor = await AccountModel.findOne({ email: email }).exec();
  let info = await transporter.sendMail({
    from: "KhaVinhThuan", // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `Hello ${findinfor.username},\n\nYour account details are as follows:\n\nUsername: ${findinfor.username}\nPassword: ${findinfor.password}\n\nPlease keep this information safe and do not share it with anyone.\n\nBest regards,\nKhaVinhThuan`, // plain text body
  });
};

export default sendMail;
