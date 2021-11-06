const fs = require("fs");
const readline = require("readline");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });
const path = require("path");
const txt = fs.createWriteStream(path.join(__dirname, "text.txt"), "utf-8");
output.write("Hi! Please, write smth\n");
rl.on("line", writeData);
function writeData(data) {
  if (data.toString() == "exit") 
    rl.close();
  else if (!txt.write(data + "\n")) {
    rl.removeListener("line", writeData);
    txt.once("drain", () => {
      rl.on("line", writeData);
      writeData();
    });
  }
}
txt.on("error", (err) => output.write("error: " + err));
rl.on("close", () => {
  output.write("Хуш!");
  txt.end();
});
