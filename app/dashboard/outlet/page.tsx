
"use client";

import "./outlet.scss";
import { useState } from "react";
import OutletEditModal from "./OutletEditModal";
type Outlet = {
  id: string;
  name: string;
  manager: string;
  contact: string;
  status: string;
  employees: string;
};

const outlets: Outlet[] = [
  {
    id: "main-processing",
    name: "Main Processing Plant",
    manager: "John smith",
    contact: "+977-9800390288",
    status: "Active",
    employees: "45 Employee",
  },
  {
    id: "warehouse",
    name: "Warehouse",
    manager: "John smith",
    contact: "+977-9800390288",
    status: "Active",
    employees: "45 Employee",
  },
];

export default function OutletPage() {
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const selectedOutlet =
    outlets.find((outlet) => outlet.id === selectedOutletId) ?? outlets[0];
  const closeModal = () => setSelectedOutletId(null);

  return (
    <section className="outletPage">
      <div className="breadcrumb">
        <span>Settings</span> {"›"} Outlet Management
      </div>

      <div className="pageHeader">
        <h1 className="pageTitle">Outlet Management</h1>
        <p className="pageSubtitle">
          Manage processing plants, retail stores, and distribution centers
        </p>
      </div>

      <div className="cardList">
        {outlets.map((outlet) => (
          <article key={outlet.id} className="card">
            <div className="cardTop">
              <h2 className="cardTitle">{outlet.name}</h2>
              <div className="badgeGroup">
                <span className="badge badgeActive">
                  {outlet.status}
                </span>
                <span className="badge">{outlet.employees}</span>
              </div>
            </div>

            <div className="cardBody">
              <label className="field">
                <span className="label">Manager</span>
                <input
                  className="input"
                  defaultValue={outlet.manager}
                />
              </label>

              <label className="field">
                <span className="label">Contact</span>
                <input
                  className="input"
                  defaultValue={outlet.contact}
                />
              </label>

              <label className="field">
                <span className="label">Status</span>
                <select className="select" defaultValue={outlet.status}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
            </div>

            <div className="cardActions">
              <button type="button" className="button">
                View details
              </button>
              <button
                type="button"
                className="button buttonPrimary"
                onClick={() => setSelectedOutletId(outlet.id)}
              >
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>

      <OutletEditModal
        isOpen={Boolean(selectedOutletId)}
        outlet={selectedOutlet}
        onClose={closeModal}
      />
    </section>
  );
}

