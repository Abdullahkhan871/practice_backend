import e from "express";
import db from "./config/db.js"
const app = e();
dotenv.config()

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productsRouter.js";



db();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(e.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/products", productRouter);



app.get("/", (req, res) => {
    res.send("working");
})
const PORT = process.env.PORT || 5000
app.listen(PORT)