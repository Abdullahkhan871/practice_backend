import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config()

import authRouter from "./routes/authRouter.js";
import db from "./config/mongodb.js"
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import feedRouter from "./routes/feedRouter.js";

db()

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("working")
})

app.use("/", feedRouter);
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/post", postRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// dotenv ?
// const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); ?