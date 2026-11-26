import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../services/authService";

function useLogout() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["currentUser"],
        exact: true,
      });
    },
  });

  return mutation;
}
export default useLogout;
