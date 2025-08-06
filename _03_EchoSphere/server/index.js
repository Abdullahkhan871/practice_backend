import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.routes.js";
import { db } from "./config/db.js";
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./config/cloudinary.js"
import cors from "cors";

// socket start 
import { Server } from "socket.io";
import http from "http"


dotenv.config();
db();
cloudinaryConfig();

const app = express();
app.use(cors());


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["Get", "POST"],
  }
});



io.on("connection", (socket) => {
})


app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});