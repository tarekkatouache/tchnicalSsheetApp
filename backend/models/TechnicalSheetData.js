const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // adjust path as needed

const TechnicalSheetData = sequelize.define(
  "TechnicalSheetData",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    instrumentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    systemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    technicalSheetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    field1: {
      type: DataTypes.TEXT,
    },
    field2: {
      type: DataTypes.TEXT,
    },
    field3: {
      type: DataTypes.TEXT,
    },
    field4: {
      type: DataTypes.TEXT,
    },
    field5: {
      type: DataTypes.TEXT,
    },
    field6: {
      type: DataTypes.TEXT,
    },
    field7: {
      type: DataTypes.TEXT,
    },
    field8: {
      type: DataTypes.TEXT,
    },
    field9: {
      type: DataTypes.TEXT,
    },
    field10: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "technical_sheet_data",
    timestamps: true,
  }
);

// TechnicalSheetData.belongsTo(User, { foreignKey: "userId" });
// TechnicalSheetData.belongsTo(System, { foreignKey: "systemId" });
// TechnicalSheetData.belongsTo(Instrument, { foreignKey: "instrumentId" });
// TechnicalSheetData.belongsTo(TechnicalSheet, {
//   foreignKey: "technicalSheetId",
// });

module.exports = TechnicalSheetData;
