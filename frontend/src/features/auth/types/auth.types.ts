export type AuthUser = {
  id: string;
  email: string;
  created_at: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiMessageResponse = {
  success: boolean;
  message: string;
};

export type ApiErrorResponse = {
  success: boolean;
  message: string;
};
