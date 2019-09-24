"use strict";
require("array-flat-polyfill");
const info = require("../package.json");
const path = require("path");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const program = require("commander");

const {
  isCSV,
  getOriginalFilename,
  getResolvedPath,
  writeSJsonToFile
} = require("./system-actions");

const {
  makeYearReports,
  groupPerYear,
  setDate,
  linkKeyToValue,
  isValidWeatherTuple
} = require("./data-manipulation");

program.version(info.version).description(info.description);

program
  .command("parse <path> [destination]")
  .description("parses BOM weather data CSV file and converts the data to JSON")
  .action((pathToFile, destination) => {
    const resolvedPath = path.resolve(pathToFile);
    if (isCSV(resolvedPath)) {
      let weatherData;
      try {
        weatherData = fs.readFileSync(resolvedPath, {
          encoding: "utf-8"
        });
      } catch (err) {
        throw new Error(err);
      }

      const perYearRecords = parse(weatherData, {
        bom: true
      })
        .filter(isValidWeatherTuple)
        .map(linkKeyToValue)
        .slice(1) //removes first entry which held the labels
        .map(setDate)
        .reduce(groupPerYear, new Map());

      const yearReports = makeYearReports(perYearRecords);

      const resolvedPathToDestination = getResolvedPath(destination);

      if (resolvedPathToDestination === null) {
        console.log(JSON.stringify(yearReports, null, "  "));
      } else if (fs.existsSync(resolvedPathToDestination)) {
        const filename = getOriginalFilename(resolvedPath);
        const outputFilePath = path.join(
          resolvedPathToDestination,
          `${filename}.json`
        );
        writeSJsonToFile(outputFilePath, yearReports);
      } else {
        console.log("Please enter a valid destination folder");
      }
    } else {
      console.log("Please enter a CSV file.");
    }
  });

//if no arguments passed, sets value to -h to force commander to show the help info
if (process.argv[2] === undefined) {
  process.argv[2] = "-h";
}

program.parse(process.argv);
