const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
const snippetRoutes = require("../routes/snippet.route");
app.use("/api/snippets", snippetRoutes);
const genCodeRoutes = require("../routes/genCode.route");
app.use("/api/gencodes", genCodeRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
