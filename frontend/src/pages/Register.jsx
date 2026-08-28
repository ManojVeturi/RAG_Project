import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !companyCode.trim() ||
      !email.trim() ||
      !password
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: name.trim(),
        company_code: companyCode.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(
        "Account created successfully. You can now sign in."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const detail =
        error.response?.data?.detail;

      let message =
        "Registration failed. Please try again.";

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
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Enterprise AI
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Support & Knowledge Agent
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Create employee account
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Join your company's enterprise workspace.
            </p>
          </div>

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

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="John Doe"
                autoComplete="name"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Company Code */}
            <div>
              <label
                htmlFor="companyCode"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Company Registration Code
              </label>

              <input
                id="companyCode"
                type="text"
                value={companyCode}
                onChange={(event) =>
                  setCompanyCode(event.target.value)
                }
                placeholder="e.g. ACME-X7K29P"
                autoComplete="off"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm uppercase text-slate-900 outline-none placeholder:text-slate-400 placeholder:normal-case focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                Ask your company administrator for the
                registration code.
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@company.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Re-enter your password"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Enterprise Support & Knowledge Agent
        </p>

      </div>
    </div>
  );
}