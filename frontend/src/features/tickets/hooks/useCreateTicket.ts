import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicket } from "../services/ticketService";
import type { ApiResponse } from "../../auth/types/auth.types";
import type { CreateTicketInput, Ticket } from "../types/ticket.types";

function useCreateTicket() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ApiResponse<Ticket>, unknown, CreateTicketInput>(
    {
      mutationFn: ({ title, description }) => {
        return createTicket(title, description);
      },

      onSuccess: () => {
        return queryClient.invalidateQueries({ queryKey: ["tickets"] });
      },
    },
  );

  return mutation;
}

export default useCreateTicket;
