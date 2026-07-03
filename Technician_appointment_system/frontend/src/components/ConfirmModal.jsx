export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Go back',
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onCancel}>
      <div
        className="modal modal--small"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__stub" aria-hidden="true" />
        <h2 id="confirm-modal-title" className="modal__title">
          {title}
        </h2>
        <p className="modal__message">{message}</p>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${tone === 'danger' ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
