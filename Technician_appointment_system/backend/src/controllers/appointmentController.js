const db = require('../db/database');

const COLUMNS = [
  'technician_name',
  'customer_name',
  'service_type',
  'appointment_date',
  'appointment_time',
  'location',
  'issue_description',
  'status',
  'service_charge',
];

// GET /api/appointments
// Supports optional query params: status, technician_name, sort, order
function getAllAppointments(req, res, next) {
  try {
    const { status, technician_name, sort = 'appointment_date', order = 'ASC' } = req.query;

    const allowedSortColumns = ['appointment_date', 'appointment_time', 'technician_name', 'status', 'created_at'];
    const sortColumn = allowedSortColumns.includes(sort) ? sort : 'appointment_date';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = 'SELECT * FROM technician_appointment';
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (technician_name) {
      conditions.push('technician_name LIKE ?');
      params.push(`%${technician_name}%`);
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    query += ` ORDER BY ${sortColumn} ${sortOrder}, appointment_time ${sortOrder}`;

    const rows = db.prepare(query).all(...params);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/appointments/:id
function getAppointmentById(req, res, next) {
  try {
    const row = db
      .prepare('SELECT * FROM technician_appointment WHERE appointment_id = ?')
      .get(req.params.id);

    if (!row) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

// POST /api/appointments
function createAppointment(req, res, next) {
  try {
    const payload = {
      technician_name: req.body.technician_name.trim(),
      customer_name: req.body.customer_name.trim(),
      service_type: req.body.service_type.trim(),
      appointment_date: req.body.appointment_date,
      appointment_time: req.body.appointment_time,
      location: req.body.location.trim(),
      issue_description: req.body.issue_description ? req.body.issue_description.trim() : null,
      status: req.body.status || 'Scheduled',
      service_charge: Number(req.body.service_charge),
    };

    const columnsSql = COLUMNS.join(', ');
    const placeholders = COLUMNS.map(() => '?').join(', ');
    const stmt = db.prepare(
      `INSERT INTO technician_appointment (${columnsSql}) VALUES (${placeholders})`
    );
    const result = stmt.run(...COLUMNS.map((col) => payload[col]));

    const created = db
      .prepare('SELECT * FROM technician_appointment WHERE appointment_id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json({ success: true, data: created, message: 'Appointment created successfully.' });
  } catch (err) {
    next(err);
  }
}

// PUT /api/appointments/:id
function updateAppointment(req, res, next) {
  try {
    const existing = db
      .prepare('SELECT * FROM technician_appointment WHERE appointment_id = ?')
      .get(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const payload = {
      technician_name: req.body.technician_name.trim(),
      customer_name: req.body.customer_name.trim(),
      service_type: req.body.service_type.trim(),
      appointment_date: req.body.appointment_date,
      appointment_time: req.body.appointment_time,
      location: req.body.location.trim(),
      issue_description: req.body.issue_description ? req.body.issue_description.trim() : null,
      status: req.body.status || existing.status,
      service_charge: Number(req.body.service_charge),
    };

    const setClause = COLUMNS.map((col) => `${col} = ?`).join(', ');
    const stmt = db.prepare(
      `UPDATE technician_appointment SET ${setClause} WHERE appointment_id = ?`
    );
    stmt.run(...COLUMNS.map((col) => payload[col]), req.params.id);

    const updated = db
      .prepare('SELECT * FROM technician_appointment WHERE appointment_id = ?')
      .get(req.params.id);

    res.json({ success: true, data: updated, message: 'Appointment updated successfully.' });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/appointments/:id/status  (lightweight status-only update, e.g. Cancel)
function updateAppointmentStatus(req, res, next) {
  try {
    const { status } = req.body;
    const existing = db
      .prepare('SELECT * FROM technician_appointment WHERE appointment_id = ?')
      .get(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    db.prepare('UPDATE technician_appointment SET status = ? WHERE appointment_id = ?').run(
      status,
      req.params.id
    );

    const updated = db
      .prepare('SELECT * FROM technician_appointment WHERE appointment_id = ?')
      .get(req.params.id);

    res.json({ success: true, data: updated, message: `Appointment marked as ${status}.` });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/appointments/:id
function deleteAppointment(req, res, next) {
  try {
    const existing = db
      .prepare('SELECT * FROM technician_appointment WHERE appointment_id = ?')
      .get(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    db.prepare('DELETE FROM technician_appointment WHERE appointment_id = ?').run(req.params.id);

    res.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};
