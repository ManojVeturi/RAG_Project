import { useEffect, useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  History as HistoryIcon,
  RefreshCw,
  User,
} from "lucide-react";

import api from "../services/api";

export default function History() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/chat/history");

      setConversations(response.data);
    } catch (error) {
      console.error("Failed to load chat history:", error);

      const detail = error.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to load chat history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const toggleConversation = (id) => {
    setExpandedId((current) =>
      current === id ? null : id
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chat History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View your previous conversations with the AI assistant.
          </p>
        </div>

        <button
          type="button"
          onClick={loadHistory}
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
            Loading chat history...
          </p>
        </div>
      ) : conversations.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <HistoryIcon size={24} />
          </div>

          <h2 className="text-base font-semibold text-slate-900">
            No conversations yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your questions and AI responses will appear here
            after you use the assistant.
          </p>
        </div>
      ) : (
        /* Conversations */
        <div className="space-y-3">
          {conversations.map((conversation) => {
            const isExpanded =
              expandedId === conversation.id;

            return (
              <div
                key={conversation.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Question header */}
                <button
                  type="button"
                  onClick={() =>
                    toggleConversation(conversation.id)
                  }
                  className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <User size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {conversation.question}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(
                        conversation.created_at
                      )}
                    </p>
                  </div>

                  <div className="shrink-0 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </button>

                {/* Answer */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600">
                        <Bot size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                          AI Assistant
                        </p>

                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          {conversation.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}