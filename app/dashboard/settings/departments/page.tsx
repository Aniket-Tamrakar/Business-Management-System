"use client";

import "./departments.scss";
import { useState } from "react";
import Modal from "../../../components/Modal/Modal";

const departments = [
  { id: "production", name: "Production", status: "Active" },
  { id: "retail", name: "Retail", status: "Active" },
];

export default function DepartmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="departmentsPage">
      <div className="breadcrumb">
        <span>Settings</span> {"›"} Department
      </div>

      <div className="departmentsHeader">
        <div className="departmentsHeaderText">
          <h1 className="pageTitle">Department</h1>
          <p className="pageSubtitle">
            Organize your team by departments for clarity
          </p>
        </div>
        <button
          type="button"
          className="button buttonPrimary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Department
        </button>
      </div>

      <div className="departmentsSearch">
        <span className="searchIcon">🔍</span>
        <input className="searchInput" placeholder="Search" />
      </div>

      <div className="departmentsTable">
        <div className="departmentsRow departmentsRowHeader">
          <span>Department</span>
          <span>Status</span>
          <span />
        </div>
        {departments.map((department) => (
          <div key={department.id} className="departmentsRow">
            <span>{department.name}</span>
            <span>
              <span className="badge badgeActive">{department.status}</span>
            </span>
            <button type="button" className="moreButton" aria-label="More">
              ⋮
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add Department"
        subtitle="Quickly add a new department"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="button modalButton"
              onClick={() => setIsModalOpen(false)}
            >
              Discard
            </button>
            <button type="button" className="button buttonPrimary modalButton">
              Save
            </button>
          </>
        }
      >
        <label className="modalField">
          <span className="label">Department name</span>
          <input className="input" defaultValue="Production" />
        </label>

        <label className="modalField">
          <span className="label">Status</span>
          <select className="select" defaultValue="Active">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
      </Modal>
    </section>
  );
}

