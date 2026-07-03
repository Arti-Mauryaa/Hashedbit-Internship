import { formatCurrency, formatDate, formatDaysUntil, formatTime, getDaysUntil } from '../utils/dateUtils';

const STATUS_STYLES = {
  Scheduled: 'badge--scheduled',
  'In Progress': 'badge--progress',
  Completed: 'badge--completed',
  Cancelled: 'badge--cancelled',
};

export default function AppointmentTable({ appointments, loading, onEdit, onDelete, onCancel }) {
  if (loading) {
    return (
      <div className="table-state">
        <div className="spinner" aria-hidden="true" />
        <p>Loading appointments…</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="table-state">
        <p className="table-state__title">No appointments yet</p>
        <p className="table-state__hint">Add a new appointment to start filling the schedule.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Technician</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Date &amp; Time</th>
            <th>Days Until</th>
            <th>Charge</th>
            <th>Status</th>
            <th className="table__actions-head">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => {
            const daysUntil = getDaysUntil(appt.appointment_date);
            const isPast = daysUntil < 0;
            const canCancel = appt.status === 'Scheduled' || appt.status === 'In Progress';

            return (
              <tr key={appt.appointment_id}>
                <td data-label="Technician">
                  <span className="cell-primary">{appt.technician_name}</span>
                </td>
                <td data-label="Customer">{appt.customer_name}</td>
                <td data-label="Service">{appt.service_type}</td>
                <td data-label="Date & Time">
                  <span className="cell-primary">{formatDate(appt.appointment_date)}</span>
                  <span className="cell-secondary">{formatTime(appt.appointment_time)}</span>
                </td>
                <td data-label="Days Until">
                  <span className={`days-chip ${isPast ? 'days-chip--past' : ''}`}>
                    {formatDaysUntil(appt.appointment_date)}
                  </span>
                </td>
                <td data-label="Charge" className="cell-mono">
                  {formatCurrency(appt.service_charge)}
                </td>
                <td data-label="Status">
                  <span className={`badge ${STATUS_STYLES[appt.status] || ''}`}>{appt.status}</span>
                </td>
                <td data-label="Actions" className="table__actions">
                  <button type="button" className="icon-btn" onClick={() => onEdit(appt)} title="Edit">
                    Edit
                  </button>
                  {canCancel && (
                    <button
                      type="button"
                      className="icon-btn icon-btn--warn"
                      onClick={() => onCancel(appt)}
                      title="Cancel appointment"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    onClick={() => onDelete(appt)}
                    title="Delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
