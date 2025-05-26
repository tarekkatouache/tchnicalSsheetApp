const { DataTypes } = require("sequelize"); // import DataTypes from sequelize
const sequelize = require("../db"); // import the sequelize connection
const User = require("./User"); // import User model
const System = require("./System"); // import System model

const Instrument = sequelize.define(
  // define the Instrument model
  "Instrument",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    systemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: System,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    updatedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "instruments",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["systemId", "name"], // enforce unique instrument names per system
      },
    ],
  }
);

// Set up associations
Instrument.belongsTo(System, { foreignKey: "systemId" });
Instrument.belongsTo(User, { foreignKey: "updatedByUserId", as: "updatedBy" });

module.exports = Instrument;
