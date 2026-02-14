"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/schema/auth";

export default function LoginPage() {
  const router = useRouter();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    // TODO: call login API via useMutation when endpoint is ready
    router.push("/dashboard");
  };

  return (
    <div className="authCard">
      <div className="authHeader">
        <h1 className="authTitle">Sign in</h1>
        <p className="authSubtitle">Enter your credentials to access BMS.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="authForm">
        {errors.root?.message && (
          <p className="authError">{errors.root.message}</p>
        )}
        <label htmlFor="login-email" className="authField">
          <span className="authLabel">Email</span>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            className="authInput"
            autoComplete="email"
            {...registerField("email")}
          />
          {errors.email && (
            <span className="authFieldError">{errors.email.message}</span>
          )}
        </label>
        <label htmlFor="login-password" className="authField">
          <span className="authLabel">Password</span>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            className="authInput"
            autoComplete="current-password"
            {...registerField("password")}
          />
          {errors.password && (
            <span className="authFieldError">{errors.password.message}</span>
          )}
        </label>
        <div className="authActions">
          <button
            type="submit"
            className="authButton authButtonPrimary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
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
