import e from "express";
import db from "./config/db.js"
const app = e();
dotenv.config()

import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";



db();

app.use(e.json())
app.use(cookieParser());

app.use("/auth", authRouter)



app.get("/", (req, res) => {
    res.send("working");
})
const PORT = process.env.PORT || 5000
app.listen(PORT)