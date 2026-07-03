const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// Uses Node's built-in `node:sqlite` module (available since Node 22.5+,
// no native compilation or extra dependency required).
const DB_PATH = path.join(__dirname, 'tas.sqlite');
const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// SQLite has no native ENUM type, so status is constrained with a CHECK
// constraint instead, mirroring the ENUM('Scheduled','In Progress','Completed','Cancelled')
// requirement from the spec. Timestamps are managed with triggers so
// `updated_at` behaves like MySQL's `ON UPDATE CURRENT_TIMESTAMP`.
db.exec(`
  CREATE TABLE IF NOT EXISTS technician_appointment (
    appointment_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    technician_name     TEXT NOT NULL,
    customer_name       TEXT NOT NULL,
    service_type        TEXT NOT NULL,
    -- appointment_date is NOT NULL; "not in the past" is enforced in the
    -- application layer (on create only) rather than as a DB CHECK, because
    -- a CHECK re-validates on every UPDATE and would block legitimate status
    -- changes (e.g. marking something "Completed") once its date passes.
    appointment_date    TEXT NOT NULL,
    appointment_time    TEXT NOT NULL,
    location             TEXT NOT NULL,
    issue_description   TEXT,
    status               TEXT NOT NULL DEFAULT 'Scheduled'
                          CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    service_charge       REAL NOT NULL CHECK (service_charge >= 0),
    created_at           TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at           TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TRIGGER IF NOT EXISTS trg_technician_appointment_updated_at
  AFTER UPDATE ON technician_appointment
  FOR EACH ROW
  BEGIN
    UPDATE technician_appointment
    SET updated_at = datetime('now')
    WHERE appointment_id = OLD.appointment_id;
  END;
`);

module.exports = db;
