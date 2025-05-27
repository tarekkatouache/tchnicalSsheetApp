const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const TechnicalSheetData = require("../models/TechnicalSheetData"); // your Sequelize model

// controllers/technicalSheetDataController.js

async function processTechnicalSheetData(filePath, metadata) {
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const fields = [];
  let rowIndex = 1;

  // Read values from Column C (3rd column)
  while (true) {
    const cellAddress = `C${rowIndex}`;
    const cell = worksheet[cellAddress];

    if (!cell || !cell.v) break; // Exit if cell is empty

    fields.push(cell.v);
    rowIndex++;
  }

  // Map extracted fields into DB structure
  const data = {
    technicalSheetId: metadata.technicalSheetId,
    userId: metadata.userId,
    instrumentId: metadata.instrumentId,
    systemId: metadata.systemId,
  };

  // Assign values dynamically up to field10
  for (let i = 0; i < 10; i++) {
    data[`field${i + 1}`] = fields[i] || null;
  }

  await TechnicalSheetData.create(data);
}

module.exports = { processTechnicalSheetData };
