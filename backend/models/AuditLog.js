const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Adjust the path to your Sequelize instance if needed

const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userLogged: {
      type: DataTypes.STRING, // e.g., 'admin@domain.com' or just a name
      allowNull: true,
    },
    action: {
      type: DataTypes.ENUM("CREATE", "UPDATE", "DELETE"), // extendable
      allowNull: false,
    },
    entity: {
      type: DataTypes.STRING, // e.g., 'System', 'Instrument', 'User'
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "audit_logs",
    timestamps: true, // includes createdAt (when action happened)
    updatedAt: false, // disable updatedAt since logs shouldn't be updated
  }
);

module.exports = AuditLog;
