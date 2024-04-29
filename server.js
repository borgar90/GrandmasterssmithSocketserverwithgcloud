const express = require("express");
const http = require("http");
const cors = require("cors");
const corsOptions = require("./cors").default;
const app = express();
const server = http.createServer(app);
const connectDB = require("./db");
const multer = require("multer");

/**
 * @description Serveren bruker cookie-parser, express.json og cors for å håndtere cookies, json og cors.
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 */

app.set("trust proxy", true);

app.use(cors(corsOptions));

app.use(express.json());

connectDB();

// Import API and socket routes
const apiRoutes = require("./apiRoutes");
const socketRoutes = require("./socketRoutes");

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(500).send({ message: err.message });
  } else if (err) {
    res.status(500).send({ message: err.message });
  } else {
    next();
  }
});

// Use API routes
app.use("/api", apiRoutes);
socketRoutes(server);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
