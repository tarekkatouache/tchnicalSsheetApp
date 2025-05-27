const { DataTypes } = require("sequelize");
const sequelize = require("../db.js"); // this  point tp db.js file
const TechnicalSheetData = require("./TechnicalSheetData");

const TechnicalSheet = sequelize.define(
  "TechnicalSheet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    instrumentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "instruments",
        key: "id",
      },
    },
    uploadedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    originalFilePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pdfFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Technical_Sheets",
    timestamps: true, //
    paranoid: true,
  }
);
TechnicalSheet.hasMany(TechnicalSheetData, { foreignKey: "technicalSheetId" });
TechnicalSheetData.belongsTo(TechnicalSheet, {
  foreignKey: "technicalSheetId",
});

module.exports = TechnicalSheet;
