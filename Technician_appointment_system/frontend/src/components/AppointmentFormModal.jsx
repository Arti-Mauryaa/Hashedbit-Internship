import { useEffect, useState } from 'react';
import { todayISODate } from '../utils/dateUtils';

const STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

const EMPTY_FORM = {
  technician_name: '',
  customer_name: '',
  service_type: '',
  appointment_date: '',
  appointment_time: '',
  location: '',
  issue_description: '',
  status: 'Scheduled',
  service_charge: '',
};

export default function AppointmentFormModal({ open, mode, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              technician_name: initialData.technician_name ?? '',
              customer_name: initialData.customer_name ?? '',
              service_type: initialData.service_type ?? '',
              appointment_date: initialData.appointment_date ?? '',
              appointment_time: initialData.appointment_time ?? '',
              location: initialData.location ?? '',
              issue_description: initialData.issue_description ?? '',
              status: initialData.status ?? 'Scheduled',
              service_charge: initialData.service_charge ?? '',
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, initialData]);

  if (!open) return null;

  const isEdit = mode === 'edit';

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.technician_name.trim()) next.technician_name = 'Technician name is required.';
    if (!form.customer_name.trim()) next.customer_name = 'Customer name is required.';
    if (!form.service_type.trim()) next.service_type = 'Service type is required.';
    if (!form.location.trim()) next.location = 'Location is required.';

    if (!form.appointment_date) {
      next.appointment_date = 'Appointment date is required.';
    } else if (!isEdit && form.appointment_date < todayISODate()) {
      next.appointment_date = 'Date cannot be in the past.';
    }

    if (!form.appointment_time) next.appointment_time = 'Appointment time is required.';

    if (form.service_charge === '' || form.service_charge === null) {
      next.service_charge = 'Service charge is required.';
    } else if (Number.isNaN(Number(form.service_charge)) || Number(form.service_charge) < 0) {
      next.service_charge = 'Enter a non-negative amount.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        service_charge: Number(form.service_charge),
        issue_description: form.issue_description.trim() || null,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-form-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__stub" aria-hidden="true">
          <span className="modal__stub-label">Work Order</span>
        </div>

        <div className="modal__header">
          <h2 id="appointment-form-title" className="modal__title">
            {isEdit ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button type="button" className="modal__close" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__grid">
            <Field label="Technician Name" error={errors.technician_name}>
              <input
                type="text"
                value={form.technician_name}
                onChange={(e) => update('technician_name', e.target.value)}
                placeholder="e.g. Rahul Verma"
              />
            </Field>

            <Field label="Customer Name" error={errors.customer_name}>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => update('customer_name', e.target.value)}
                placeholder="e.g. Anita Sharma"
              />
            </Field>

            <Field label="Service Type" error={errors.service_type}>
              <input
                type="text"
                value={form.service_type}
                onChange={(e) => update('service_type', e.target.value)}
                placeholder="e.g. AC Repair"
              />
            </Field>

            <Field label="Status" error={errors.status}>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Appointment Date" error={errors.appointment_date}>
              <input
                type="date"
                value={form.appointment_date}
                min={!isEdit ? todayISODate() : undefined}
                onChange={(e) => update('appointment_date', e.target.value)}
              />
            </Field>

            <Field label="Appointment Time" error={errors.appointment_time}>
              <input
                type="time"
                value={form.appointment_time}
                onChange={(e) => update('appointment_time', e.target.value)}
              />
            </Field>

            <Field label="Service Charge (₹)" error={errors.service_charge}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.service_charge}
                onChange={(e) => update('service_charge', e.target.value)}
                placeholder="0.00"
              />
            </Field>

            <Field label="Location" error={errors.location} full>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Address or site name"
              />
            </Field>

            <Field label="Issue Description (optional)" error={errors.issue_description} full>
              <textarea
                rows={3}
                maxLength={500}
                value={form.issue_description}
                onChange={(e) => update('issue_description', e.target.value)}
                placeholder="Describe the problem the technician needs to address"
              />
            </Field>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children, full }) {
  return (
    <label className={`field ${full ? 'field--full' : ''} ${error ? 'field--error' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}
