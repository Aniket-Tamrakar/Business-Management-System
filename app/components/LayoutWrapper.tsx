"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/app/providers/AuthProvider";
import ToastProvider from "@/app/providers/ToastProvider";
import Sidebar from "./Sidebar/Sidebar";
import "./Sidebar/Sidebar.scss";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <main className="flex h-screen flex-1 flex-col items-center overflow-y-auto bg-white px-8 pt-8 pb-[7px] dark:bg-black sm:items-start">
            {children}
          </main>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
