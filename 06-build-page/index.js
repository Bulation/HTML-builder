const fs = require("fs");
const path = require("path");
const createBundle = require("../05-merge-styles/index.js");
const { copyFolder, copyFolderUnlink } = require("../04-copy-directory/index.js");

const pathToDist = path.join(__dirname, "project-dist");
fs.promises.mkdir(pathToDist, { recursive: true });

const pathToAssetsCopyFolder = path.join(__dirname, "project-dist", "assets");
fs.promises.mkdir(pathToAssetsCopyFolder, { recursive: true });

const pathToStyleFolder = path.join(__dirname, "styles");
const bundleStream = fs.createWriteStream(path.join(__dirname, "project-dist", "style.css"), "utf-8");
const pathToAssetsFolder = path.join(__dirname, "assets");
const templateWriteStream = fs.createWriteStream(path.join(__dirname, "project-dist", "index.html"));
const templateReadStream = fs.createReadStream(path.join(__dirname, "template.html"), "utf-8");
let template = "";
templateReadStream.on("data", (chunk) => {
    template += chunk;
});

async function createComponentsPromises(componentsFolder) {
    let componentsArr = [];
    return new Promise((res, rej) => {
        fs.promises.readdir(componentsFolder).then((components) => {
            for (let component of components) {
                if (path.extname(component) == ".html") {
                    componentsArr.push(
                      new Promise((res, rej) => {
                        let componentReadStream = fs.createReadStream(
                          path.join(componentsFolder, component),
                          "utf-8"
                        );
                        let data = "";
                        componentReadStream.on("data", (chunk) => {
                          data += chunk;
                        });
                        componentReadStream.on("end", () => {
                          let componentObj = {};
                          let name = path.basename(
                            component,
                            path.extname(component)
                          );
                          componentObj[name] = data;
                          res(componentObj);
                        });
                        componentReadStream.on("error", (err) => {
                          rej(err);
                        });
                      })
                    );
                }
            }
            res(Promise.all(componentsArr));
        });
    })
}

createComponentsPromises(path.join(__dirname, "components")).then((componentsArr) => {
    for (let component of componentsArr) {
      for (let tag in component) {
        template = template.replaceAll(`{{${tag}}}`, component[tag]);
      }
    }
}).then(() => {
    templateWriteStream.write(template);
}).catch((err) => console.error("error: ", err));

createBundle(pathToStyleFolder, bundleStream);
copyFolderUnlink(pathToAssetsFolder, pathToAssetsCopyFolder);
copyFolder(pathToAssetsFolder, pathToAssetsCopyFolder);