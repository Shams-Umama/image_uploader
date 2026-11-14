const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/", uploadRoutes);

app.get("/", (req, res) => {
    res.send("Server Running");
});

app.listen(5000, () => {
    console.log("Server Started on Port 5000");
});
