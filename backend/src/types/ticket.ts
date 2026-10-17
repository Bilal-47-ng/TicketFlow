export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Ticket = {
  id: string;
  user_id: string;
  title: string;
  priority: string;
  status: string;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export type TicketUpdateInput = {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
};

export type TicketFilters = {
  status?: Ticket["status"];
  priority?: Ticket["priority"];
  search?: string;
};
