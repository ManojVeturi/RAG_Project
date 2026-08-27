import {
  Menu,
  LogOut,
  UserCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-slate-500">
          Welcome back
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">
            {user?.name || user?.email}
          </p>

          <p className="text-xs capitalize text-slate-500">
            {user?.role}
          </p>
        </div>

        <UserCircle
          size={32}
          className="text-slate-400"
        />

        <button
          onClick={logout}
          title="Logout"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}