const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("CDIS Backend is Running 🚀");
});

module.exports = app;