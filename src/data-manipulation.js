const moment = require("moment");
const DECIMAL_PRECISION = 3;

function formatRecordedDate(date) {
  return moment(date).format("YYYY-MM-DD");
}

function getFirstRecordedDate(dayEntries) {
  const { date } = dayEntries.slice().sort((a, b) => a.date - b.date)[0];
  return formatRecordedDate(date);
}

function getLastRecordedDate(dayEntries) {
  const { date } = dayEntries.slice().sort((a, b) => a.date - b.date)[
    dayEntries.length - 1
  ];
  return formatRecordedDate(date);
}

function getLongestNumberOfDaysRaining(dayEntries) {
  return dayEntries.reduce(
    ({ count, streak }, { rainfallAmount }) => {
      if (Number(rainfallAmount) !== 0) {
        count++;
      } else {
        if (count > streak) {
          streak = count;
        }
        count = 0;
      }

      return { count, streak };
    },
    {
      streak: 0,
      count: 0
    }
  ).streak;
}

function getDaysWithRainfall(dayEntries) {
  return dayEntries.reduce(
    (rainyDays, { rainfallAmount }) =>
      Number(rainfallAmount) !== 0 ? rainyDays + 1 : rainyDays,
    0
  );
}

function getDaysWithNoRainfall(dayEntries) {
  return dayEntries.reduce(
    (dryDays, { rainfallAmount }) =>
      Number(rainfallAmount) === 0 ? dryDays + 1 : dryDays,
    0
  );
}

function getAverageDailyRainfall(dayEntries) {
  const totalEntries = dayEntries.length;
  return dayEntries
    .reduce(
      (amount, { rainfallAmount }) =>
        amount + Number(rainfallAmount) / totalEntries,
      0
    )
    .toFixed(DECIMAL_PRECISION);
}

function getTotalRainfall(dayEntries) {
  return dayEntries
    .reduce((amount, { rainfallAmount }) => amount + Number(rainfallAmount), 0)
    .toFixed(DECIMAL_PRECISION);
}

function groupPerYear(map, dayEntry) {
  const { Year } = dayEntry;
  const entries = map.get(Year) || [];
  return map.set(Year, [...entries, dayEntry]);
}

function setDate(entry) {
  const { Year, Month, Day } = entry;
  return {
    ...entry,
    date: new Date(`${Year} ${Number(Month)} ${Number(Day)}`)
  };
}

function linkKeyToValue(entry, i, arr) {
  const keys = arr[0];
  keys[5] = "rainfallAmount";
  keys[6] = "daysPeriod";
  const objEntry = {};
  entry.forEach((value, i) => {
    objEntry[keys[i]] = value;
  });
  return objEntry;
}

function isValidWeatherTuple(arr) {
  const hasEightValues = arr.length === 8;
  const hasRainData = arr[5] !== "" && arr[5] !== undefined && arr[5] !== "";
  return hasEightValues && hasRainData;
}

module.exports = {
  formatRecordedDate,
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
};
