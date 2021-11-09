const fs = require('fs');
const path = require('path');
const pathToCopyFolder = path.join(__dirname, "files-copy");
fs.promises.mkdir(pathToCopyFolder, { recursive: true });

async function copyFolderUnlink(folder, pathToCopyFolder) {
  try {
    let pathToFolder = await fs.promises.readdir(folder);
    fs.promises.readdir(pathToCopyFolder).then((arr) => {
        arr.map(async (el) => {
            let stat = await fs.promises.stat(path.join(pathToCopyFolder, el));
            if (!pathToFolder.includes(el) && !stat.isDirectory())
                fs.promises.unlink(path.join(pathToCopyFolder, el));
            else if (stat.isDirectory() && pathToFolder.includes(el)) {
              copyFolderUnlink(
                path.join(folder, el),
                path.join(pathToCopyFolder, el)
              );
            } else if (!pathToFolder.includes(el) && stat.isDirectory()) {
              fs.promises.rm(path.join(pathToCopyFolder, el), {
                recursive: true,
              });
            }
        });
    });
  }
  catch (err) {
    console.error("error: ", err)
  }
}

copyFolderUnlink(path.join(__dirname, "files"), pathToCopyFolder);

async function copyFolder(folder, pathToCopyFolder) {
    try {
        let files = await fs.promises.readdir(folder);
        files.forEach(async (file) => {
            let stat = await fs.promises.stat(path.join(folder, file));
            if (stat.isDirectory()) {
                fs.promises.mkdir(path.join(pathToCopyFolder, file), { recursive: true });
                copyFolder(path.join(folder, file), path.join(pathToCopyFolder, file));
            }
            else {
                fs.promises.copyFile(path.join(folder, file), path.join(pathToCopyFolder, file)).catch((err) => console.error("error: ", err));
            }
        });
    } catch (err) {
        console.error("error: ", err);
    }
}

copyFolder(path.join(__dirname, "files"), pathToCopyFolder).catch((err) =>
  console.error("error: ", err)
);

module.exports = {
  copyFolder: copyFolder,
  copyFolderUnlink: copyFolderUnlink,
}; 