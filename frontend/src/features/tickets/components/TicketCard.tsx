import type { Ticket } from "../types/ticket.types";

const badgeBaseStyles =
  "inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-xs font-medium";

const statusStyles = {
  OPEN: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-slate-100 text-slate-700",
};

const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

function TicketCard({
  title,
  description,
  status,
  priority,
  created_at,
}: Ticket) {
  return (
    <div className="bg-white border rounded-xl p-5 border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg min-w-0 truncate font-semibold text-slate-900">
          {title}
        </h2>
        <span className={`${badgeBaseStyles} ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2">{description}</p>

      <div className="flex items-center justify-between gap-3">
        <p className={`${badgeBaseStyles} ${priorityStyles[priority]}`}>
          {priority}
        </p>
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {new Date(created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default TicketCard;
