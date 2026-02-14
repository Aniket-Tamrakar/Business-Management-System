"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="authCard">
      <div className="authHeader">
        <h1 className="authTitle">Create account</h1>
        <p className="authSubtitle">Register to get started with BMS.</p>
      </div>

      <form onSubmit={handleSubmit} className="authForm">
        {error && <p className="authError">{error}</p>}
        <label htmlFor="register-name" className="authField">
          <span className="authLabel">Name</span>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="authInput"
            autoComplete="name"
          />
        </label>
        <label htmlFor="register-email" className="authField">
          <span className="authLabel">Email</span>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="authInput"
            autoComplete="email"
          />
        </label>
        <label htmlFor="register-password" className="authField">
          <span className="authLabel">Password</span>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="authInput"
            autoComplete="new-password"
          />
        </label>
        <label htmlFor="register-confirm" className="authField">
          <span className="authLabel">Confirm password</span>
          <input
            id="register-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="authInput"
            autoComplete="new-password"
          />
        </label>
        <div className="authActions">
          <button type="submit" className="authButton authButtonPrimary">
            Create account
          </button>
        </div>
      </form>

      <p className="authFooter">
        Already have an account?{" "}
        <Link href="/login" className="authLink">
          Sign in
        </Link>
      </p>
    </div>
  );
}
