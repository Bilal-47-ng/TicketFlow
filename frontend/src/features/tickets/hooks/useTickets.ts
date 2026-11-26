import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../services/ticketService";

function useTickets(page: number, limit: number) {
  const query = useQuery({
    queryKey: ["tickets", page, limit],
    queryFn: ({ queryKey }) => {
      const [, page, limit] = queryKey;
      return getTickets(Number(page), Number(limit));
    },
  });

  return query;
}

export default useTickets;
