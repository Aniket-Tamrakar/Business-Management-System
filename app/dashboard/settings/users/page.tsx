"use client";
import "./users.scss";
import { useState } from "react";
import Modal from "../../../components/Modal/Modal";

const users = [
  {
    id: "EMP-002",
    name: "Admin",
    role: "Administrator",
    status: "Active",
    contact: "Admin@Meattrack.Com",
  },
  {
    id: "EMP-002",
    name: "John Smith",
    role: "Manager",
    status: "Active",
    contact: "John@Meattrack.Com",
  },
];

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="usersPage">
      <div className="breadcrumb">
        <span>Settings</span> {"›"} User Management
      </div>

      <div className="usersHeader">
        <div className="usersHeaderText">
          <h1 className="pageTitle">User Management</h1>
          <p className="pageSubtitle">Manage system users and permissions</p>
        </div>
        <button
          type="button"
          className="button buttonPrimary"
          onClick={() => setIsModalOpen(true)}
        >
          Add User
        </button>
      </div>

      <div className="usersSearch">
        <span className="searchIcon">🔍</span>
        <input className="searchInput" placeholder="Search" />
      </div>

      <div className="usersTable">
        <div className="usersRow usersRowHeader">
          <span>Employee ID</span>
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
          <span>Contact</span>
          <span />
        </div>
        {users.map((user) => (
          <div key={`${user.id}-${user.name}`} className="usersRow">
            <span>{user.id}</span>
            <span>{user.name}</span>
            <span>{user.role}</span>
            <span>
              <span className="badge badgeActive">{user.status}</span>
            </span>
            <span>{user.contact}</span>
            <button type="button" className="moreButton" aria-label="More">
              ⋮
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add User"
        subtitle="Quickly add a new user to your team"
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
          <span className="label">Name</span>
          <input className="input" defaultValue="Admin" />
        </label>

        <label className="modalField">
          <span className="label">Role</span>
          <input className="input" defaultValue="Administrator" />
        </label>

        <label className="modalField">
          <span className="label">Status</span>
          <select className="select" defaultValue="Active">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <label className="modalField">
          <span className="label">Contact</span>
          <input className="input" defaultValue="Abc@gmail.com" />
        </label>
      </Modal>
    </section>
  );
}

