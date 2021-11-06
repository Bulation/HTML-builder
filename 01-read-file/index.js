const fs = require("fs");
const process = require("process");
const path = require("path");
const txt = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");
txt.on("data", (chunk) => {
  process.stdout.write(chunk);
});
txt.on("error", (err) => process.stderr.write("error: " + err));
