import { useCallback, useEffect, useState } from 'react';
import AppointmentTable from './components/AppointmentTable';
import AppointmentFormModal from './components/AppointmentFormModal';
import ConfirmModal from './components/ConfirmModal';
import { useToast } from './components/ToastContext';
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  updateAppointment,
  updateAppointmentStatus,
} from './api/appointments';

const STATUS_FILTERS = ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

export default function App() {
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [formModal, setFormModal] = useState({ open: false, mode: 'create', data: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, appt: null, action: null });

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.technician_name = search.trim();
      const res = await fetchAppointments(params);
      setAppointments(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  function openCreateModal() {
    setFormModal({ open: true, mode: 'create', data: null });
  }

  function openEditModal(appt) {
    setFormModal({ open: true, mode: 'edit', data: appt });
  }

  function closeFormModal() {
    setFormModal({ open: false, mode: 'create', data: null });
  }

  async function handleFormSubmit(payload) {
    try {
      if (formModal.mode === 'edit') {
        await updateAppointment(formModal.data.appointment_id, payload);
        showToast('Appointment updated successfully.', 'success');
      } else {
        await createAppointment(payload);
        showToast('Appointment added successfully.', 'success');
      }
      closeFormModal();
      loadAppointments();
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    }
  }

  function askDelete(appt) {
    setConfirmModal({ open: true, appt, action: 'delete' });
  }

  function askCancel(appt) {
    setConfirmModal({ open: true, appt, action: 'cancel' });
  }

  function closeConfirmModal() {
    setConfirmModal({ open: false, appt: null, action: null });
  }

  async function handleConfirm() {
    const { appt, action } = confirmModal;
    try {
      if (action === 'delete') {
        await deleteAppointment(appt.appointment_id);
        showToast('Appointment deleted successfully.', 'success');
      } else if (action === 'cancel') {
        await updateAppointmentStatus(appt.appointment_id, 'Cancelled');
        showToast('Appointment cancelled.', 'success');
      }
      closeConfirmModal();
      loadAppointments();
    } catch (err) {
      showToast(err.message || 'Action failed. Please try again.', 'error');
      closeConfirmModal();
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__eyebrow">Dispatch Board</span>
          <h1>Technician Appointment System</h1>
        </div>
        <button type="button" className="btn btn--primary" onClick={openCreateModal}>
          + Add Appointment
        </button>
      </header>

      <section className="toolbar">
        <div className="toolbar__filters">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip-filter ${statusFilter === s ? 'chip-filter--active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="toolbar__search"
          placeholder="Search by technician…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {error && (
        <div className="alert alert--error">
          Couldn&apos;t load appointments: {error}. Check that the backend server is running.
        </div>
      )}

      <AppointmentTable
        appointments={appointments}
        loading={loading}
        onEdit={openEditModal}
        onDelete={askDelete}
        onCancel={askCancel}
      />

      <AppointmentFormModal
        open={formModal.open}
        mode={formModal.mode}
        initialData={formModal.data}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.action === 'delete' ? 'Delete appointment?' : 'Cancel appointment?'}
        message={
          confirmModal.action === 'delete'
            ? `This will permanently remove ${confirmModal.appt?.customer_name}'s ${confirmModal.appt?.service_type} appointment. This can't be undone.`
            : `This marks ${confirmModal.appt?.customer_name}'s ${confirmModal.appt?.service_type} appointment as Cancelled.`
        }
        confirmLabel={confirmModal.action === 'delete' ? 'Delete' : 'Cancel Appointment'}
        cancelLabel="Go back"
        tone="danger"
        onConfirm={handleConfirm}
        onCancel={closeConfirmModal}
      />
    </div>
  );
}
