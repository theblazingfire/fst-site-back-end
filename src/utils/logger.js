const fs = require("fs");
const path = require("path");
const config = require("./config");

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../request.log"),
  { flags: "a" },
);

let logToConsole = true;
if (config.NODE_ENV === "production") {
  logToConsole = false;
}

const writeLogToFile = (data) => {
  fs.appendFileSync(path.join(__dirname, "../applog.md"), data, "utf8");
};

const formatTime = (time) => {
  return `*${time.toISOString()}*`;
};

const formatData = (data) => {
  if (typeof data === "object") {
    return `\`\`\`javascript\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`;
  } else {
    return `${data}\n`;
  }
};

const infoLogger = (data) => {
  let time = new Date();
  let logEntry = `## Info\n${formatTime(time)}\n${formatData(data)}`;

  if (logToConsole) {
    console.info(logEntry);
  }

  writeLogToFile(logEntry);
};

const errorLogger = (data) => {
  let time = new Date();
  let logEntry = `## Error\n${formatTime(time)}\n${formatData(data)}`;

  if (logToConsole) {
    console.error(logEntry);
  }

  writeLogToFile(logEntry);
};

module.exports = {
  infoLogger,
  errorLogger,
  accessLogStream,
};
