import { useEffect, useState } from "react";
import {
  FileText,
  RefreshCw,
  Upload,
  Trash2,
} from "lucide-react";

import api from "../services/api";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/documents");

      setDocuments(response.data);
    } catch (error) {
      const detail = error.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile || uploading) {
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await api.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(
        `${response.data.filename} uploaded and processed successfully.`
      );

      setSelectedFile(null);

      event.target.reset();

      await loadDocuments();
    } catch (error) {
      const detail = error.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Document upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(
        `/documents/${documentId}`
      );

      setSuccess(
        "Document deleted successfully."
      );

      await loadDocuments();
    } catch (error) {
      const detail = error.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to delete document."
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Knowledge Base
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage documents used by the AI knowledge system.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDocuments}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} />

          Refresh
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Upload */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900">
            Upload document
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Supported formats: PDF, DOCX, TXT, and Markdown.
          </p>
        </div>

        <form
          onSubmit={handleUpload}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={(event) =>
              setSelectedFile(
                event.target.files?.[0] || null
              )
            }
            disabled={uploading}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={17} />

            {uploading
              ? "Uploading..."
              : "Upload"}
          </button>
        </form>
      </div>

      {/* Documents */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Documents
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {documents.length} document
            {documents.length !== 1 ? "s" : ""}
            {" "}in the knowledge base
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-10 text-center">
            <FileText
              size={32}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="text-sm font-medium text-slate-700">
              No documents found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Upload a document to add it to the knowledge base.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {document.filename}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>
                        {document.file_type}
                      </span>

                      <span>
                        ID: {document.id}
                      </span>

                      <span
                        className={
                          document.status ===
                          "processed"
                            ? "font-medium text-green-600"
                            : document.status ===
                              "failed"
                            ? "font-medium text-red-600"
                            : "text-slate-500"
                        }
                      >
                        {document.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(document.id)
                  }
                  className="inline-flex w-fit items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />

                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}