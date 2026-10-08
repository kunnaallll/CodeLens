import Button from "./Button";
import Modal from "./Modal";

export default function ConfirmDialog({ open, onCancel, onConfirm, title = "Are you sure?", description, confirmLabel = "Delete", loading }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-ink-600">{description}</p>
    </Modal>
  );
}
