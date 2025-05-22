const { DataTypes } = require("sequelize"); // import DataTypes from sequelize
const sequelize = require("../db"); // import the sequelize connection

const User = sequelize.define(
  "User",
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
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    jobTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    service: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // password will be hashed
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING, // URL or local path
      allowNull: true,
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user", // to make default role "user"
      validate: {
        isIn: [["admin", "user"]], // to only allow these values
      },
    },
  },
  {
    tableName: "users",
    timestamps: true, // createdAt and updatedAt
    paranoid: true,
  }
);

// Associations
const AuditLog = require("./AuditLog"); // import AuditLog model
//

User.hasMany(AuditLog, { foreignKey: "userId" });

module.exports = User;
