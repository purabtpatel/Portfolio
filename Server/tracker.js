// tracker.js
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "traffic.log");

export function trackTraffic(req, res, next) {
  // Skip internal API routes if you only care about frontend hits
  if (req.originalUrl.startsWith("/api")) return next();

  const log = {
    time: new Date().toISOString(),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    route: req.originalUrl,
    ua: req.headers["user-agent"],
  };

  fs.appendFile(LOG_FILE, JSON.stringify(log) + "\n", err => {
    if (err) console.error("Traffic log error:", err);
  });

  next();
}
