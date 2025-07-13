import express from "express";
import bodyParser from "body-parser";
import PostController from "../Controller/PostController.js";
import multer from 'multer';
import fs from 'fs';

const uploadsDir = './uploads';

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const upload = multer({ dest: uploadsDir });
const router_Post = express.Router();
router_Post.use(bodyParser.urlencoded({ extended: true }));

router_Post.post('/submit-post', upload.array('images', 4), PostController.UpPost);

router_Post.post('/renderpost', PostController.RenderPost);

router_Post.get('/rendermp', PostController.RenderMPPost);
export default router_Post;