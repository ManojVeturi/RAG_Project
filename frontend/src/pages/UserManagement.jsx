import { useEffect, useState } from "react";
import { UserPlus, Users } from "lucide-react";

import api from "../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);

      const detail = error.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    setCreating(true);

    try {
      await api.post("/admin/users/employee", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setName("");
      setEmail("");
      setPassword("");

      setSuccess(
        "Employee created successfully."
      );

      await loadUsers();
    } catch (error) {
      console.error("Failed to create employee:", error);

      const detail = error.response?.data?.detail;

      let message = "Unable to create employee.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail
          .map(
            (item) =>
              item?.msg || "Invalid input."
          )
          .join(", ");
      } else if (
        detail &&
        typeof detail === "object"
      ) {
        message =
          detail.msg ||
          detail.message ||
          message;
      }

      setError(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          User Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage employees in your company.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

        {/* Create Employee */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <UserPlus size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Add Employee
              </h2>

              <p className="text-xs text-slate-500">
                Add an employee to your company
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreate}
            className="space-y-4"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="employee-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <input
                id="employee-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="John Doe"
                disabled={creating}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="employee-email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="employee-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="john@company.com"
                disabled={creating}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="employee-password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Temporary password
              </label>

              <input
                id="employee-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Minimum 8 characters"
                disabled={creating}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating
                ? "Creating..."
                : "Create Employee"}
            </button>

          </form>
        </div>

        {/* Users */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Users size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Company Employees
                </h2>

                <p className="text-xs text-slate-500">
                  {users.filter(
                    (user) => user.role === "employee"
                  ).length}{" "}
                  employee
                  {users.filter(
                    (user) => user.role === "employee"
                  ).length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

            </div>

          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading employees...
            </div>
          ) : users.filter(
              (user) => user.role === "employee"
            ).length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No employees found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {users
                .filter(
                  (user) => user.role === "employee"
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      Employee
                    </span>

                  </div>
                ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}