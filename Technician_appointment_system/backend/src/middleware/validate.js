const STATUS_VALUES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidDate(value) {
  if (!isNonEmptyString(value)) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());
}

function isValidTime(value) {
  if (!isNonEmptyString(value)) return false;
  return /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(value);
}

function isTodayOrFuture(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const given = new Date(`${dateStr}T00:00:00`);
  return given.getTime() >= today.getTime();
}

/**
 * Validates the request body for creating an appointment.
 * All required fields must be present and valid.
 */
function validateCreate(req, res, next) {
  const errors = validateFields(req.body, { isCreate: true });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}

/**
 * Validates the request body for updating an appointment.
 * Fields are still checked for validity, but the "not in the past"
 * date rule is relaxed so existing appointments can still be edited
 * (e.g. changing status) after their date has passed.
 */
function validateUpdate(req, res, next) {
  const errors = validateFields(req.body, { isCreate: false });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}

function validateFields(body, { isCreate }) {
  const errors = [];
  const {
    technician_name,
    customer_name,
    service_type,
    appointment_date,
    appointment_time,
    location,
    issue_description,
    service_charge,
    status,
  } = body;

  if (!isNonEmptyString(technician_name)) {
    errors.push('technician_name is required and must be a non-empty string.');
  }
  if (!isNonEmptyString(customer_name)) {
    errors.push('customer_name is required and must be a non-empty string.');
  }
  if (!isNonEmptyString(service_type)) {
    errors.push('service_type is required and must be a non-empty string.');
  }
  if (!isNonEmptyString(location)) {
    errors.push('location is required and must be a non-empty string.');
  }

  if (!isValidDate(appointment_date)) {
    errors.push('appointment_date is required and must be a valid date (YYYY-MM-DD).');
  } else if (isCreate && !isTodayOrFuture(appointment_date)) {
    errors.push('appointment_date cannot be in the past.');
  }

  if (!isValidTime(appointment_time)) {
    errors.push('appointment_time is required and must be a valid time (HH:MM).');
  }

  if (issue_description !== undefined && issue_description !== null && typeof issue_description !== 'string') {
    errors.push('issue_description must be a string.');
  }

  if (service_charge === undefined || service_charge === null || service_charge === '') {
    errors.push('service_charge is required.');
  } else if (Number.isNaN(Number(service_charge)) || Number(service_charge) < 0) {
    errors.push('service_charge must be a non-negative decimal number.');
  }

  if (status !== undefined && status !== null && status !== '' && !STATUS_VALUES.includes(status)) {
    errors.push(`status must be one of: ${STATUS_VALUES.join(', ')}.`);
  }

  return errors;
}

module.exports = { validateCreate, validateUpdate, STATUS_VALUES };
