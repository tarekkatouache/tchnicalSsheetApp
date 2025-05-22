const AuditLog = require("../models/AuditLog");

/**
 * Logs an action performed by a user into the AuditLogs table.
 *
 * @param {Object} params - Log details. // object containing the parameters
 * @param {number} params.userId - ID of the user who performed the action. // userId of the user who performed the action
 * @param {string} params.action - Action type (e.g., "CREATE", "UPDATE", "DELETE").
 * @param {string} params.entity - The name of the affected entity (e.g., "User", "System", "Instrument").
 * @param {number|string|null} [params.entityId=null] - The ID of the affected entity (if applicable).
 * @param {string} params.description - Detailed description of what happened.
 */
const logAction = async ({
  userId,
  action,
  entity,
  entityId = null,
  description,
}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId,
      description,
      userLogged,
    });
  } catch (error) {
    console.error("❌ Failed to log action:", error);
  }
};

module.exports = logAction;
