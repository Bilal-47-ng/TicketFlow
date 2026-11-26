import { useState } from "react";
import useTickets from "../hooks/useTickets";
import useCreateTicket from "../hooks/useCreateTicket";
import axios from "axios";
import type { ApiErrorResponse } from "../../auth/types/auth.types";
import TicketCard from "../components/TicketCard";
import { Plus, Ticket, X } from "lucide-react";

function TicketsPage() {
  const { data, isLoading, isError } = useTickets(1, 10);
  const createTicketMutation = useCreateTicket();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const tickets = data?.data ?? [];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    createTicketMutation.mutate(
      { title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setIsFormOpen(false);
        },
      },
    );
  }

  const errorMessage = axios.isAxiosError<ApiErrorResponse>(
    createTicketMutation.error,
  )
    ? (createTicketMutation.error.response?.data.message ?? "Network error")
    : "Something went wrong";

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500 ">
        Loading tickets...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center font-medium text-red-600">
        Something went wrong!
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            My Tickets
          </h1>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {tickets.length}
          </span>
        </div>

        <button
          type="submit"
          onClick={() => setIsFormOpen((open) => !open)}
          className="inline-flex items-center justify-center gap-2 text-md rounded-lg bg-blue-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800">
          {isFormOpen ? <X size={18} /> : <Plus size={18} />}
          {isFormOpen ? "Close" : "Create Ticket"}
        </button>
      </section>

      {isFormOpen && (
        <section>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">New Ticket</h2>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-slate-700">
                Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter ticket title"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe your issue..."
                className="min-h-32 w-full resize-y rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:ring-blue-100 focus:ring-2"
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  createTicketMutation.isPending ||
                  !title.trim() ||
                  !description.trim()
                }
                className="rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                {createTicketMutation.isPending
                  ? "creating..."
                  : "Create Ticket"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Mutation Error */}
      {createTicketMutation.isError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {/* Ticket  Grid */}
      <section>
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-12 text-center">
            <Ticket size={36} className="text-slate-400" />
            <h2 className="font-semibold text-slate-800">No tickets yet</h2>
            <p className="text-sm text-slate-500">
              Create your first ticket to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-col-2 xl:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} {...ticket} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TicketsPage;
