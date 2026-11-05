export type User = {
  id: string;
  email: string;
  password_hash: string;
  google_id: string;
  created_at: Date;
  updated_at: Date;
};

export type RegisteredUser = {
  id: string;
  email: string;
  created_at: Date;
};

export type LoginUser = {
  id: string;
  email: string;
  created_at: Date;
};
