import type { Ticket, TicketsResponse } from "../types/ticket.types";
import api from "../../../lib/axios";
import type { ApiResponse } from "../../auth/types/auth.types";

export async function getTickets(
  page: number,
  limit: number,
): Promise<TicketsResponse> {
  const response = await api.get<TicketsResponse>("/api/tickets", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export async function createTicket(
  title: string,
  description: string,
): Promise<ApiResponse<Ticket>> {
  const response = await api.post<ApiResponse<Ticket>>("/api/tickets", {
    title,
    description,
  });

  return response.data;
}
