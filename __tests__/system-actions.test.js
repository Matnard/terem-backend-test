const { isCSV, getOriginalFilename } = require("../src/system-actions");

test('checks if "/mydoc.csv" has a csv file extension', () => {
  expect(isCSV("/mydoc.csv")).toBe(true)
});

test('checks if "/myimage.bmp" has not a csv file extension', () => {
  expect(isCSV("/myimage.bmp")).toBe(false)
});


test('returns "filename" from "filename.ext"', ()=> {
  expect(getOriginalFilename("filename.ext")).toBe("filename");
});
