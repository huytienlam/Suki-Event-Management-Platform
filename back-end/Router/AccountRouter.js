import express from "express";
import bodyParser from "body-parser";
import AccountController from "../Controller/AccountController.js";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/sign-in', AccountController.PostSignin);

router.post('/sign-up', AccountController.PostSignup);

router.post('/forgot-password', AccountController.PostForget_Pass);

router.post('/delete-account', AccountController.DeleteAccount);

router.post('/change-password', AccountController.ChangePassword);
export default router;