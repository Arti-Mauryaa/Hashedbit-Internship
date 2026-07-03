/**
 * Calculates the number of whole days between today and the given
 * appointment date. This is computed on the frontend at render time,
 * per the spec (appointment_date - current date).
 */
export function getDaysUntil(appointmentDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointmentDate = new Date(`${appointmentDateStr}T00:00:00`);
  appointmentDate.setHours(0, 0, 0, 0);

  const diffMs = appointmentDate.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDaysUntil(appointmentDateStr) {
  const days = getDaysUntil(appointmentDateStr);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
}

export function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function todayISODate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
