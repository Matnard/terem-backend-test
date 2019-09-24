const path = require("path");
const fs = require("fs");

function isCSV(pathSegment) {
  return path.extname(pathSegment) === ".csv";
}

function getOriginalFilename(pathSegment) {
  return path.basename(pathSegment).split(".")[0];
}

function getResolvedPath(pathSegment) {
  return pathSegment === undefined ? null : path.resolve(pathSegment);
}

function writeSJsonToFile(path, data) {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, " "), {
      encoding: "utf-8"
    });
  } catch (err) {
    throw new Error(err);
  }

  console.log("Done.");
}

module.exports = {
  isCSV,
  getOriginalFilename,
  getResolvedPath,
  writeSJsonToFile
};
