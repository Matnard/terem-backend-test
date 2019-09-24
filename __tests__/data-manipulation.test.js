const {
  isValidWeatherTuple
} = require("../src/data-manipulation");

test('validates data entry', () => {
  expect(isValidWeatherTuple(["IDCJAC0009","066062","1858","01","06","0.0",null,null])).toBe(true)
})

test('validates data entry', () => {
  expect(isValidWeatherTuple(["IDCJAC0009","066062","1858","01","06",,null,null])).toBe(false)
})