"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export function DashboardShell({
  email,
  children,
}: {
  email?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <Sidebar email={email} pathname={pathname} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
