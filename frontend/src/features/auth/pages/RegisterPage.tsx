import React, { useState } from "react";
import useRegister from "../hooks/useRegister";
import type { ApiErrorResponse } from "../types/auth.types";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    registerMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/login");
        },
      },
    );
  }

  const errorMessage = axios.isAxiosError<ApiErrorResponse>(
    registerMutation.error,
  )
    ? (registerMutation.error.response?.data.message ?? "Network error")
    : "Something went wrong";

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-slate-50">
      <form
        className="w-full max-w-md flex flex-col gap-4 bg-white rounded-xl p-8 border border-slate-200 shadow-sm "
        onSubmit={handleSubmit}>
        <header className="flex flex-col gap-2 mb-3">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <span className="text-slate-700 font-medium">
            to continue to TicketFlow
          </span>
        </header>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            placeholder="name@company.com"
            type="email"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            placeholder="Password"
            type="password"
            value={password}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            className="w-full rounded-lg bg-blue-500 text-white font-semibold px-4 py-3 hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={registerMutation.isPending}
            type="submit">
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
          <div className="text-center">
            <span className="mr-1">Already have an account?</span>
            <Link to="/login" className="text-blue-600 text-center font-medium">
              Sign in
            </Link>
          </div>
        </div>

        {registerMutation.isError && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-center">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}

export default RegisterPage;
