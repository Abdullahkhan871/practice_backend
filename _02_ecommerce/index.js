import e from "express";
import db from "./config/db.js"
const app = e();
dotenv.config()

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import { contactRouter } from "./routes/contactRouter.js";
import { cloudinaryConfig } from "./config/cloudinaryConfig.js";



db();
cloudinaryConfig();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/contact", contactRouter);

app.get("/", (req, res) => {
    res.send("working");
})
const PORT = process.env.PORT || 5000
app.listen(PORT)