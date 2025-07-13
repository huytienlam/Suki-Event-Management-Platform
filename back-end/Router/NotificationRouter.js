import express from "express";
import bodyParser from "body-parser";
import NotificationController from "../Controller/NotificationController.js";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/get_notification', NotificationController.GetNotification);

router.post('/add_notification', NotificationController.AddNotification);

export default router;