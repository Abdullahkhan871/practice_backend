import e from "express";
import { createServer } from "http";
import { dirname, join } from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const app = e();
const server = createServer(app);
const io = new Server(server);

const _fileURLToPath = fileURLToPath(import.meta.url);
const _dirname = dirname(_fileURLToPath);



app.get("/", (req, res) => {
    res.sendFile(join(_dirname, "public", "index.html"));
})



io.on("connection", (socket) => {
    socket.on("msg", (msg) => {
        console.log(msg)
        socket.emit("msg", "I got your message buddy")
    })




})



server.listen(5000);
