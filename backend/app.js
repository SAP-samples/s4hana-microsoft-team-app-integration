const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

// Logging
const log = require("cf-nodejs-logging-support");
log.setLoggingLevel("info");

// Express
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(log.logNetwork);

// Cache
const NodeCache = require("node-cache");
global.myCache = new NodeCache({ stdTTL: process.env.cacheTTL });

// Info
app.get("/cacheFlushAll", (req, res) => {
  try {
    global.myCache.flushAll();
    res.send("Cache is flushed all");
  } catch (error) {
    req.logger.error("Cache Flushing error", error);
    res.status(500).send("Cache Flushing All error");
  }
});

// Info
app.get("/", (req, res) => {
  res.send(`Bridge Framework Backend API for MS Teams port: ${port}`);
});

// Transcript Endpoint
global.transcriptsDictionary = [];
const TranscriptRouter = require("./router/TranscriptRouter");
app.use("/transcript", TranscriptRouter);

// System gateway
const SystemRouter = require("./router/SystemRouter");
app.use("/gateway", SystemRouter);

// Notification endpoint
const NotificationRouter = require("./router/NotificationRouter");
app.use("/notify", NotificationRouter);

// MS Bot
const path = require("path");
const ENV_FILE = path.join(__dirname, ".env");
require("dotenv").config({ path: ENV_FILE });
const botActivityHandler = require("./bots/botActivityHandler");
const botAdapter = require("./bots/botAdapter");
app.post("/api/messages", (req, res) => {
  botAdapter.processActivity(req, res, async (context) => {
    await botActivityHandler.run(context);
  });
});

// Server port
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
