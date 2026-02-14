"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="authCard">
      <div className="authHeader">
        <h1 className="authTitle">Sign in</h1>
        <p className="authSubtitle">Enter your credentials to access BMS.</p>
      </div>

      <form onSubmit={handleSubmit} className="authForm">
        {error && <p className="authError">{error}</p>}
        <label htmlFor="login-email" className="authField">
          <span className="authLabel">Email</span>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="authInput"
            autoComplete="email"
          />
        </label>
        <label htmlFor="login-password" className="authField">
          <span className="authLabel">Password</span>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="authInput"
            autoComplete="current-password"
          />
        </label>
        <div className="authActions">
          <button type="submit" className="authButton authButtonPrimary">
            Sign in
          </button>
        </div>
      </form>

      <p className="authFooter">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="authLink">
          Register
        </Link>
      </p>
    </div>
  );
}
