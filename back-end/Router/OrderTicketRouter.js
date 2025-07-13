import express from "express";
import bodyParser from "body-parser";
import OTicketController from "../Controller/OrderTicketController.js";

const router_OTicket = express.Router();

router_OTicket.use(bodyParser.urlencoded({ extended: true }));

router_OTicket.post('/order_ticket', OTicketController.OrderTicket);

router_OTicket.post('/status_order', OTicketController.StatusOrder);

router_OTicket.post('/cancel_ticket', OTicketController.CancelTicket);
export default router_OTicket;