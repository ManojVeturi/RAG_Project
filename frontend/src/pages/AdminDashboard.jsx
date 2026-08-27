import { useEffect, useState } from "react";

import {
  FileText,
  MessageSquare,
  RefreshCw,
  Ticket,
  Users,
} from "lucide-react";

import api from "../services/api";


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    tickets: 0,
    conversations: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/stats");

      setStats(response.data);
    } catch (error) {
      console.error(
        "Failed to load admin statistics:",
        error
      );

      const detail =
        error.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadStats();
  }, []);


  const statCards = [
    {
      label: "Knowledge Documents",
      value: "—",
      icon: FileText,
    },
    {
      label: "Employees",
      value: stats.employees,
      icon: Users,
    },
    {
      label: "Support Tickets",
      value: stats.tickets,
      icon: Ticket,
    },
    {
      label: "AI Conversations",
      value: stats.conversations,
      icon: MessageSquare,
    },
  ];


  return (
    <div className="mx-auto max-w-6xl">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your enterprise knowledge and support
            operations.
          </p>
        </div>


        <button
          type="button"
          onClick={loadStats}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* Error */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {statCards.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {loading
                      ? "..."
                      : stat.value}
                  </p>

                </div>


                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Icon size={20} />
                </div>

              </div>

            </div>
          );

        })}

      </div>


      {/* Administration */}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="font-medium text-slate-900">
          Administration
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use the navigation menu to manage documents,
          support tickets, users, and the enterprise
          knowledge base.
        </p>

      </div>

    </div>
  );
}