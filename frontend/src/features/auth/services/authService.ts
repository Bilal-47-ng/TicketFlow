import api from "../../../lib/axios";
import type {
  ApiMessageResponse,
  ApiResponse,
  AuthUser,
} from "../types/auth.types";

export async function login(
  email: string,
  password: string,
): Promise<ApiResponse<AuthUser>> {
  const response = await api.post<ApiResponse<AuthUser>>("/api/auth/login", {
    email: email,
    password: password,
  });

  return response.data;
}
export async function register(
  email: string,
  password: string,
): Promise<ApiResponse<AuthUser>> {
  const response = await api.post<ApiResponse<AuthUser>>("/api/auth/register", {
    email: email,
    password: password,
  });

  return response.data;
}

export async function getMe(): Promise<ApiResponse<AuthUser>> {
  const response = await api.get<ApiResponse<AuthUser>>("/api/auth/me");

  return response.data;
}

export async function logout(): Promise<ApiMessageResponse> {
  const response = await api.post<ApiMessageResponse>("/api/auth/logout");

  return response.data;
}
