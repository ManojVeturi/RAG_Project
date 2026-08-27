import {
  FileText,
  MessageSquare,
  Ticket,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Knowledge Documents",
      value: "—",
      icon: FileText,
    },
    {
      label: "Employees",
      value: "—",
      icon: Users,
    },
    {
      label: "Support Tickets",
      value: "—",
      icon: Ticket,
    },
    {
      label: "AI Conversations",
      value: "—",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your enterprise knowledge and support
          operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
                    {stat.value}
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

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-900">
          Administration
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use the navigation menu to manage documents,
          support tickets, and the enterprise knowledge
          base.
        </p>
      </div>
    </div>
  );
}