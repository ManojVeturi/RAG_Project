import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Save,
  Ticket as TicketIcon,
} from "lucide-react";

import api from "../services/api";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/tickets/admin/all"
      );

      setTickets(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load admin tickets:",
        error
      );

      const detail =
        error.response?.data?.detail;

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

  const updateTicket = async (
    ticketId,
    changes
  ) => {
    try {
      setUpdatingId(ticketId);
      setError("");

      const response = await api.patch(
        `/tickets/${ticketId}`,
        changes
      );

      setTickets((previous) =>
        previous.map((ticket) =>
          ticket.id === ticketId
            ? response.data
            : ticket
        )
      );
    } catch (error) {
      console.error(
        "Failed to update ticket:",
        error
      );

      const detail =
        error.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to update ticket."
      );
    } finally {
      setUpdatingId(null);
    }
  };

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
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Support Tickets
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage employee support requests.
          </p>
        </div>

        <button
          type="button"
          onClick={loadTickets}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              loading ? "animate-spin" : ""
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

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading support tickets...
          </p>
        </div>
      ) : tickets.length === 0 ? (
        /* Empty */
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <TicketIcon size={24} />
          </div>

          <h2 className="text-base font-semibold text-slate-900">
            No support tickets
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Employee support requests will appear here.
          </p>
        </div>
      ) : (
        /* Tickets */
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              updating={
                updatingId === ticket.id
              }
              onUpdate={updateTicket}
              getStatusStyle={getStatusStyle}
              getStatusIcon={getStatusIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
}


function TicketCard({
  ticket,
  updating,
  onUpdate,
  getStatusStyle,
  getStatusIcon,
}) {
  const [status, setStatus] = useState(
    ticket.status || "Open"
  );

  const [priority, setPriority] = useState(
    ticket.priority || "Medium"
  );

  const [category, setCategory] = useState(
    ticket.category || "General"
  );

  const hasChanges =
    status !== ticket.status ||
    priority !== ticket.priority ||
    category !== ticket.category;

  const saveChanges = () => {
    const changes = {};

    if (status !== ticket.status) {
      changes.status = status;
    }

    if (priority !== ticket.priority) {
      changes.priority = priority;
    }

    if (category !== ticket.category) {
      changes.category = category;
    }

    if (Object.keys(changes).length > 0) {
      onUpdate(ticket.id, changes);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Top section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <TicketIcon size={18} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  {ticket.title}
                </h2>

                <span className="text-xs text-slate-400">
                  #{ticket.id}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {ticket.description}
              </p>
            </div>
          </div>
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

      {/* Metadata */}
      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-400">
            User ID
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            #{ticket.user_id}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Created
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {ticket.created_at
              ? new Date(
                  ticket.created_at
                ).toLocaleString()
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            AI Summary
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {ticket.ai_summary || "—"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
        {/* Status */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={updating}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          >
            <option value="Open">Open</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Resolved">
              Resolved
            </option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Priority
          </label>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
            disabled={updating}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          >
            <option value="Low">Low</option>
            <option value="Medium">
              Medium
            </option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Category
          </label>

          <input
            type="text"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            disabled={updating}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />
        </div>
      </div>

      {/* Save */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={saveChanges}
          disabled={
            updating || !hasChanges
          }
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />

          {updating
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}