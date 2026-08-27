import {
  MessageSquare,
  Ticket,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

const actions = [
  {
    title: "Ask the AI",
    description:
      "Search the company knowledge base and get answers with sources.",
    icon: MessageSquare,
    to: "/chat",
  },
  {
    title: "View chat history",
    description:
      "Review your previous questions and answers.",
    icon: BookOpen,
    to: "/history",
  },
  {
    title: "My support tickets",
    description:
      "Track your open and resolved support requests.",
    icon: Ticket,
    to: "/tickets",
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Access company knowledge and support from one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.to}
              to={action.to}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Icon size={20} />
              </div>

              <h2 className="font-medium text-slate-900">
                {action.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600">
                Open
                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-medium text-slate-900">
          Enterprise AI Assistant
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Ask questions about company policies, procedures,
          IT support, HR information, and other documents
          available in the enterprise knowledge base.
        </p>

        <Link
          to="/chat"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ask a question
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}