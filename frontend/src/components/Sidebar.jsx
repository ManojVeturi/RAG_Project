import {
  FileText,
  History,
  LayoutDashboard,
  MessageSquare,
  Ticket,
  UserRoundCog,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const employeeLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/chat",
    label: "AI Assistant",
    icon: MessageSquare,
  },
  {
    to: "/history",
    label: "Chat History",
    icon: History,
  },
  {
    to: "/tickets",
    label: "My Tickets",
    icon: Ticket,
  },
];


const adminLinks = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/chat",
    label: "AI Assistant",
    icon: MessageSquare,
  },
  {
    to: "/documents",
    label: "Knowledge Base",
    icon: FileText,
  },
  {
    to: "/admin/tickets",
    label: "Tickets",
    icon: Ticket,
  },
  {
    to: "/admin/users",
    label: "User Management",
    icon: UserRoundCog,
  },
];


export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  const links =
    user?.role === "admin"
      ? adminLinks
      : employeeLinks;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          border-r border-slate-200 bg-white
          transition-transform duration-200
          lg:static lg:z-auto lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Enterprise AI
            </p>

            <p className="text-xs text-slate-500">
              Support & Knowledge
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}