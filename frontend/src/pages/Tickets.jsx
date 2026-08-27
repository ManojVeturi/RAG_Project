import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Ticket as TicketIcon,
} from "lucide-react";

import api from "../services/api";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tickets");

      setTickets(response.data);
    } catch (error) {
      console.error("Failed to load tickets:", error);

      const detail = error.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to load tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-blue-50 text-blue-700";

      case "in progress":
        return "bg-amber-50 text-amber-700";

      case "resolved":
      case "closed":
        return "bg-green-50 text-green-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600";

      case "medium":
        return "text-amber-600";

      case "low":
        return "text-green-600";

      default:
        return "text-slate-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <AlertCircle size={15} />;

      case "in progress":
        return <Clock3 size={15} />;

      case "resolved":
      case "closed":
        return <CheckCircle2 size={15} />;

      default:
        return <TicketIcon size={15} />;
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            My Tickets
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and track your support requests.
          </p>
        </div>

        <button
          type="button"
          onClick={loadTickets}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading tickets...
          </p>
        </div>
      ) : tickets.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <TicketIcon size={24} />
          </div>

          <h2 className="text-base font-semibold text-slate-900">
            No tickets yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your support tickets will appear here.
          </p>
        </div>
      ) : (
        /* Ticket list */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-5 transition hover:bg-slate-50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <TicketIcon
                        size={17}
                        className="shrink-0 text-slate-400"
                      />

                      <h2 className="truncate text-sm font-semibold text-slate-900">
                        {ticket.title}
                      </h2>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {ticket.description}
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                      ticket.status
                    )}`}
                  >
                    {getStatusIcon(ticket.status)}

                    {ticket.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-500">
                    Category:{" "}
                    <span className="font-medium text-slate-700">
                      {ticket.category || "General"}
                    </span>
                  </span>

                  <span
                    className={`font-medium ${getPriorityStyle(
                      ticket.priority
                    )}`}
                  >
                    Priority: {ticket.priority || "Normal"}
                  </span>

                  {ticket.created_at && (
                    <span className="text-slate-400">
                      Created{" "}
                      {new Date(
                        ticket.created_at
                      ).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
