"use client";

import Modal from "../../components/Modal/Modal";
import type { Outlet } from "@/handlers/outlet";

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
      subtitle={outlet.id}
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
        <span className="label">Manager ID</span>
        <input className="input" defaultValue={outlet.managerId} />
      </label>

      <label className="modalField">
        <span className="label">Status</span>
        <select
          className="select"
          defaultValue={outlet.status ? "Active" : "Inactive"}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>

      <label className="modalField">
        <span className="label">Contact</span>
        <input className="input" defaultValue={outlet.contact} />
      </label>
    </Modal>
  );
}

