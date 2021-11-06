const fs = require("fs");
const path = require("path");
let pathToFolder = path.join(__dirname, "secret-folder");
(async function (pathToFolder) {
  try {
    let files = await fs.promises.readdir(pathToFolder);
    files.forEach(async (file) => {
      try {
        let stat = await fs.promises.stat(path.join(pathToFolder, file));
        if (!stat.isDirectory())
          console.log(
            path.basename(file, path.extname(file)),
            "-",
            path.extname(file).slice(1),
            "-",
            stat.size / 1024 + "kb"
          );
      } catch (err) {
        console.error("error: ", err);
      }
      
    });
  } catch (err) {
    console.error("error: ", err);
  }
  
})(pathToFolder).catch((err) => console.error("error: ", err));
