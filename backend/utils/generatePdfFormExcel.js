const ExcelJS = require("exceljs");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");

async function generatePdfFromExcel(excelPath, pdfPath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);
  const worksheet = workbook.worksheets[0];

  // Extract table as HTML
  let html = "<table border='1' cellpadding='5' cellspacing='0'>";
  worksheet.eachRow((row) => {
    html += "<tr>";
    row.eachCell((cell) => {
      html += `<td>${cell.value || ""}</td>`;
    });
    html += "</tr>";
  });
  html += "</table>";

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(`
    <html>
      <head>
        <style>
          body { font-family: Arial; }
          table { border-collapse: collapse; width: 100%; }
          td, th { border: 1px solid #999; padding: 8px; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);

  await page.pdf({
    path: pdfPath,
    format: "A4",
  });

  await browser.close();
}

module.exports = generatePdfFromExcel;
