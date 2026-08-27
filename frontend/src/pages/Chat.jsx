import { useState } from "react";
import {
  Bot,
  FileText,
  Send,
  User,
  X,
  Ticket,
  CheckCircle2,
} from "lucide-react";

import api from "../services/api";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ticketMessage, setTicketMessage] = useState(null);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] =
    useState("");

  const [ticketLoading, setTicketLoading] =
    useState(false);

  const [ticketSuccess, setTicketSuccess] =
    useState("");

  const askQuestion = async (event) => {
    event?.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post(
        "/chat/ask",
        {
          question: trimmedQuestion,
        }
      );

      const data = response.data;

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            data.answer ||
            "I couldn't generate an answer.",

          sources: Array.isArray(data.sources)
            ? data.sources
            : [],

          canCreateTicket:
            data.can_create_ticket === true,

          question: trimmedQuestion,

          ticketCreated: false,
        },
      ]);
    } catch (error) {
      console.error(
        "Chat request failed:",
        error
      );

      const detail =
        error.response?.data?.detail;

      let errorMessage =
        "Something went wrong while processing your question.";

      if (typeof detail === "string") {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail
          .map((item) => {
            if (typeof item === "string") {
              return item;
            }

            return item?.msg || "Invalid request.";
          })
          .join(", ");
      } else if (
        detail &&
        typeof detail === "object"
      ) {
        errorMessage =
          detail.msg ||
          detail.message ||
          "Invalid request.";
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: errorMessage,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openTicketModal = (messageIndex, message) => {
    setTicketMessage(messageIndex);

    setTicketTitle(
      `Information request: ${message.question}`
    );

    setTicketDescription(
      `The AI Assistant could not find the requested information in the company knowledge base.\n\nEmployee question:\n${message.question}`
    );

    setTicketSuccess("");
  };

  const closeTicketModal = () => {
    if (ticketLoading) {
      return;
    }

    setTicketMessage(null);
    setTicketTitle("");
    setTicketDescription("");
    setTicketSuccess("");
  };

  const createTicket = async () => {
    if (
      !ticketTitle.trim() ||
      !ticketDescription.trim() ||
      ticketLoading
    ) {
      return;
    }

    try {
      setTicketLoading(true);
      setTicketSuccess("");

      const response = await api.post(
        "/tickets/",
        {
          title: ticketTitle.trim(),
          description:
            ticketDescription.trim(),
        }
      );

      const createdTicket = response.data;

      setMessages((previous) =>
        previous.map((message, index) =>
          index === ticketMessage
            ? {
                ...message,
                ticketCreated: true,
                ticketId: createdTicket.id,
              }
            : message
        )
      );

      setTicketSuccess(
        `Ticket #${createdTicket.id} created successfully.`
      );

      setTimeout(() => {
        closeTicketModal();
      }, 1200);
    } catch (error) {
      console.error(
        "Ticket creation failed:",
        error
      );

      const detail =
        error.response?.data?.detail;

      let message =
        "Unable to create the support ticket.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail
          .map(
            (item) =>
              item?.msg || "Invalid ticket request."
          )
          .join(", ");
      }

      setTicketSuccess(message);
    } finally {
      setTicketLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-5xl flex-col">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-900">
            AI Assistant
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Ask questions about company policies,
            procedures, and internal knowledge.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              <EmptyState
                onSuggestionClick={(text) =>
                  setQuestion(text)
                }
              />
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <Message
                    key={index}
                    message={message}
                    onCreateTicket={() =>
                      openTicketModal(
                        index,
                        message
                      )
                    }
                  />
                ))}

                {loading && <LoadingMessage />}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-4">
            <form
              onSubmit={askQuestion}
              className="flex items-end gap-3"
            >
              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    askQuestion(event);
                  }
                }}
                rows={1}
                placeholder="Ask a question..."
                disabled={loading}
                className="max-h-32 min-h-11 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />

              <button
                type="submit"
                disabled={
                  loading || !question.trim()
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>

            <p className="mt-2 text-center text-xs text-slate-400">
              AI responses are based on your
              organization's available knowledge base.
            </p>
          </div>
        </div>
      </div>

      {ticketMessage !== null && (
        <TicketModal
          title={ticketTitle}
          description={ticketDescription}
          setTitle={setTicketTitle}
          setDescription={setTicketDescription}
          loading={ticketLoading}
          success={ticketSuccess}
          onClose={closeTicketModal}
          onCreate={createTicket}
        />
      )}
    </>
  );
}


function EmptyState({ onSuggestionClick }) {
  const suggestions = [
    "How can I submit an academic grievance?",
    "What is the grievance redressal structure?",
    "What are the employee code of conduct expectations?",
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Bot size={24} />
      </div>

      <h2 className="text-lg font-medium text-slate-900">
        How can I help you?
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Ask a question about information available
        in your organization's knowledge base.
      </p>

      <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() =>
              onSuggestionClick(suggestion)
            }
            className="rounded-lg border border-slate-200 bg-white p-3 text-left text-xs text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}


function Message({
  message,
  onCreateTicket,
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Bot size={17} />
        </div>
      )}

      <div
        className={`max-w-3xl ${
          isUser ? "order-first" : ""
        }`}
      >
        <div
          className={`rounded-xl px-4 py-3 text-sm leading-6 ${
            isUser
              ? "bg-blue-600 text-white"
              : message.error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "bg-slate-100 text-slate-800"
          }`}
        >
          {message.content}
        </div>

        {!isUser &&
          message.sources?.length > 0 && (
            <Sources
              sources={message.sources}
            />
          )}

        {!isUser &&
          message.canCreateTicket &&
          !message.ticketCreated && (
            <button
              type="button"
              onClick={onCreateTicket}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <Ticket size={16} />
              Create support ticket
            </button>
          )}

        {!isUser &&
          message.ticketCreated && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
              <CheckCircle2 size={16} />
              Ticket #{message.ticketId} created
            </div>
          )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
          <User size={17} />
        </div>
      )}
    </div>
  );
}


function Sources({ sources }) {
  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-medium text-slate-500">
        Sources
      </p>

      <div className="space-y-2">
        {sources.map((source, index) => (
          <div
            key={`${source.filename}-${source.page_number}-${index}`}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <FileText
              size={15}
              className="shrink-0 text-slate-400"
            />

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-700">
                {source.filename || "Document"}
              </p>

              <p className="text-xs text-slate-400">
                Page {source.page_number}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function LoadingMessage() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Bot size={17} />
      </div>

      <div className="rounded-xl bg-slate-100 px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}


function TicketModal({
  title,
  description,
  setTitle,
  setDescription,
  loading,
  success,
  onClose,
  onCreate,
}) {
  const hasSuccess = success.startsWith(
    "Ticket #"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Create Support Ticket
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Submit this question to the support team.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5">
          {success && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                hasSuccess
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {hasSuccess && (
                <CheckCircle2
                  size={16}
                  className="mr-2 inline"
                />
              )}

              {success}
            </div>
          )}

          <div>
            <label
              htmlFor="ticket-title"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Title
            </label>

            <input
              id="ticket-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="ticket-description"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="ticket-description"
              rows={6}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              disabled={loading}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onCreate}
            disabled={
              loading ||
              !title.trim() ||
              !description.trim()
            }
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}