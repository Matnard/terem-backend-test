"use strict";
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
  getFirstRecordedDate,
  getLastRecordedDate,
  getLongestNumberOfDaysRaining,
  getDaysWithRainfall,
  getDaysWithNoRainfall,
  getAverageDailyRainfall,
  getTotalRainfall,
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
    debugger;
    const resolvedPath = path.resolve(pathToFile);
    if (isCSV(resolvedPath)) {
      const weatherData = fs.readFileSync(resolvedPath, {
        encoding: "utf-8"
      });

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
        console.log(yearReports);
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

if (process.argv[2] === undefined) {
  process.argv[2] = "-h";
}

program.parse(process.argv);

function makeYearReports(perYearRecordsMap) {
  return {
    WeatherData: Array.from(perYearRecordsMap.keys()).map(year => {
      const entriesForTheYear = perYearRecordsMap.get(year);
      return {
        WeatherDataForYear: {
          Year: year,
          FirstRecordedDate: getFirstRecordedDate(entriesForTheYear),
          LastRecordedDate: getLastRecordedDate(entriesForTheYear),
          TotalRainfall: getTotalRainfall(entriesForTheYear),
          AverageDailyRainfall: getAverageDailyRainfall(entriesForTheYear),
          DaysWithNoRainfall: getDaysWithNoRainfall(entriesForTheYear),
          DaysWithRainfall: getDaysWithRainfall(entriesForTheYear),
          LongestNumberOfDaysRaining: getLongestNumberOfDaysRaining(
            entriesForTheYear
          )
        }
      };
    })
  };
}
