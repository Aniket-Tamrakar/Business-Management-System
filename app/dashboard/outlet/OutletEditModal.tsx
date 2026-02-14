"use client";

import Modal from "../../components/Modal/Modal";

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
  return (
    <Modal
      isOpen={isOpen}
      title="Manage Outlet"
      subtitle="Quickly manage outlets"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="button modalButton" onClick={onClose}>
            Discard
          </button>
          <button type="button" className="button buttonPrimary modalButton">
            Save
          </button>
        </>
      }
    >
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
    </Modal>
  );
}

