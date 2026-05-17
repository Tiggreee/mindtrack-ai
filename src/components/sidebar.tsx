import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/projects", label: "Proyectos", icon: FolderKanban },
  { href: "/tasks", label: "Tareas", icon: ListTodo },
  { href: "/chat", label: "Chat", icon: MessageSquare },
];

export function Sidebar({
  email,
  pathname,
}: {
  email?: string | null;
  pathname: string;
}) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border px-4 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          MindTrack
        </Link>
        {email ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <form action="/api/auth/signout" method="POST">
          <Button type="submit" variant="ghost" size="sm" className="w-full">
            Salir
          </Button>
        </form>
      </div>
    </aside>
  );
}
