export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Ticket = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
};

export type PaginationResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TicketsResponse = {
  success: boolean;
  data: Ticket[];
  pagination: PaginationResponse;
};

export type CreateTicketInput = {
  title: string;
  description: string;
};
