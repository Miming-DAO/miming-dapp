export interface User {
  id: string | number;
  full_name: string;
  email: string;
  username: string;
  type: string;
  is_disabled: boolean;
  photo_url: string;
  google_account_id: string;
  session_id: string;
}

export interface CreateUserDto {
  full_name: string;
  email: string;
  username: string;
  password: string;
  type: string;
  is_disabled: boolean;
  photo_url: string;
  google_account_id: string;
  session_id: string;
}
