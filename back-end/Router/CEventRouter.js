import express from "express";
import bodyParser from "body-parser";
import CEventController from "../Controller/CEventController.js";
import multer from 'multer';
import fs from 'fs';

const uploadsDir = './uploads';

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const upload = multer({ dest: uploadsDir , limits: { fileSize: 10 * 1024 * 1024 } });
const router_ = express.Router();

router_.use(bodyParser.urlencoded({ extended: true }));

router_.post('/create_event', upload.single("logoevent"), CEventController.CEvent);

router_.post('/renderdata', CEventController.Renderdata);

router_.post('/renderevent', CEventController.RenderEvent);

router_.get('/searchevent', CEventController.SearchEvent);

router_.post('/follow', CEventController.FollowEvent)

router_.post('/join', CEventController.JoinEvent)

router_.post('/render_event_mp', CEventController.RenderEventMP)

router_.get('/admin_renderevent', CEventController.AdminRenderEvent)

router_.post('/admin_approveevent', CEventController.AdminApproveEvent)

router_.post('/followers', CEventController.Followers)

router_.post('/cancelevent', CEventController.CancelEvent)

router_.post('/editevent', CEventController.EditEvent)
export default router_;