import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/authService";

function useCurrentUser() {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });

  return query;
}
export default useCurrentUser;
