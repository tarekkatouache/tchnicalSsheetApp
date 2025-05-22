const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const System = sequelize.define(
  "System",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // each system name should be unique
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "systems",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = System;
