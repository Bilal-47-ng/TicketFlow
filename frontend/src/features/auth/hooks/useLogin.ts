import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../services/authService";
import type { ApiResponse, AuthUser } from "../types/auth.types";

type LoginVariables = {
  email: string;
  password: string;
};

function useLogin() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ApiResponse<AuthUser>, unknown, LoginVariables>({
    mutationFn: ({ email, password }) => {
      return login(email, password);
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });

  return mutation;
}

export default useLogin;
