import { useMutation } from "@tanstack/react-query";
import type { ApiResponse, AuthUser } from "../types/auth.types";
import { register } from "../services/authService";

type RegisterVariables = {
  email: string;
  password: string;
};

function useRegister() {
  const mutation = useMutation<
    ApiResponse<AuthUser>,
    unknown,
    RegisterVariables
  >({
    mutationFn: ({ email, password }) => {
      return register(email, password);
    },
  });

  return mutation;
}

export default useRegister;
