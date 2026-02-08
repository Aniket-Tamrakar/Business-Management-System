"use client";

type Outlet = {
  id: string;
  name: string;
  manager: string;
  contact: string;
  status: string;
  employees: string;
};

type OutletEditModalProps = {
  isOpen: boolean;
  outlet: Outlet;
  onClose: () => void;
};

export default function OutletEditModal({
  isOpen,
  outlet,
  onClose,
}: OutletEditModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalOverlay" onClick={onClose} aria-hidden="true">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="outlet-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <div>
            <h2 id="outlet-modal-title" className="modalTitle">
              Manage Outlet
            </h2>
            <p className="modalSubtitle">Quickly manage outlets</p>
          </div>
          <button
            type="button"
            className="modalClose"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modalBody">
          <label className="modalField">
            <span className="label">Outlet</span>
            <input className="input" defaultValue={outlet.name} />
          </label>

          <label className="modalField">
            <span className="label">Manager</span>
            <input className="input" defaultValue={outlet.manager} />
          </label>

          <label className="modalField">
            <span className="label">Status</span>
            <select className="select" defaultValue={outlet.status}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <label className="modalField">
            <span className="label">Contact</span>
            <input className="input" defaultValue={outlet.contact} />
          </label>

          <label className="modalField">
            <span className="label">Email</span>
            <input className="input" defaultValue="abc@email.com" />
          </label>
        </div>

        <div className="modalActions">
          <button type="button" className="button modalButton" onClick={onClose}>
            Discard
          </button>
          <button type="button" className="button buttonPrimary modalButton">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

