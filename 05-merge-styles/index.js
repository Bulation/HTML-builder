const fs = require("fs");
const path = require("path");
const pathToStyleFolder = path.join(__dirname, "styles");
const bundle = fs.createWriteStream(path.join(__dirname, "project-dist", "bundle.css"),"utf-8");

async function createBundle(pathToStyleFolder, bundle) {
  try {
    let files = await fs.promises.readdir(pathToStyleFolder);
    files.forEach((file) => {
      if (path.extname(file) == ".css") {
        let data = fs.createReadStream(path.join(pathToStyleFolder, file), "utf-8");
        data.pipe(bundle);
        data.on("error", (err) => console.error("error: ", err));
      }
    });
  } 
  catch (err) {
    console.error("error: ", err);
  }
}

createBundle(pathToStyleFolder, bundle).catch((err) =>
  console.error("error: ", err)
);

module.exports = createBundle;

