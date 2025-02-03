require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require("./routes/userRoutes");

app.use(express.json()); // Middleware to parse JSON

//connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.error(err));

app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("running");
});