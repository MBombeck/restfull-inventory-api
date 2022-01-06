const log4js = require('log4js');
const db = require('./SQLService');
const helper = require('./helperService');
const config = require('../config/config');

const logger = log4js.getLogger();

// GET complete inventory
async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, hostname, uuid, ip, os, version, uptime, created_at
    FROM inventory ORDER BY created_at DESC LIMIT ?,?`,
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

module.exports = {
  getMultiple,
};
// POST a new PC
async function create(pc) {
  const result = await db.query(
    `INSERT INTO inventory 
    (hostname, uuid, ip, os, version, uptime) 
    VALUES 
    (?, ?, ?, ?, ?, ?)`,
    [pc.hostname, pc.uuid, pc.ip, pc.os, pc.version, pc.uptime]
  );

  let message = 'Error in creating pc';

  if (result.affectedRows) {
    message = 'Inventory item created successfully';
    logger.info('New inventory item created:', pc.hostname);
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
};

// Update inventory item via PUT-Request
async function update(hostname, pc) {
  const result = await db.query(
    `UPDATE inventory 
    SET uuid=?, ip=?, 
    os=?, version=?, uptime=?
    WHERE hostname=?`,
    [pc.uuid, pc.ip, pc.os, pc.version, pc.uptime, hostname]
  );

  let message = 'Error in updating pc';

  if (result.affectedRows) {
    message = 'Inventory item updated successfully';
    logger.info('Inventory item updated:', hostname);
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
};

// DELETE inventory item
async function remove(id) {
  const result = await db.query(`DELETE FROM inventory WHERE id=?`, [id]);

  let message = 'Error in deleting PC';

  if (result.affectedRows) {
    message = 'Inventory item deleted successfully';
    logger.info('Inventory item deleted:', id);
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
