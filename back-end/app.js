import express from "express";
import cors from 'cors'; // Thêm import cors
import connectDatabase from './Services/ConnectDBService.js';
// import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from "path";
import { dirname } from 'path';
import router_ from "./Router/CEventRouter.js";
import router from "./Router/AccountRouter.js"; 
import router_Pfile from "./Router/ProfileRouter.js"; 
import router_OTicket from "./Router/OrderTicketRouter.js"; 
import router_Post from "./Router/PostRouter.js";
import router_Interac from "./Router/InteractionRouter.js";
import router_notifi from "./Router/NotificationRouter.js";
connectDatabase();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors({
  origin: '*', // Change this to the specific origin of your Vite app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.options('*', cors()); // Enable pre-flight across the board

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
app.use('/', router_);
app.use('/', router_Pfile);
app.use('/', router_OTicket);
app.use('/', router_Post);
app.use('/', router_Interac);
app.use('/', router_notifi);
const PORT = 3000;
const HOST = 'localhost'; // Lắng nghe trên localhost

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
