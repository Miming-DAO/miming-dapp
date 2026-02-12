export class User {
  id: string = "";
  full_name: string = "";
  email: string = "";
  username: string = "";
  type: string = "";
  auth_type: string = "";
  is_disabled: boolean = false;
  photo_url: string = "";
  google_account_id: string = "";
}

export class CreateUserDto {
  full_name: string = "";
  email: string = "";
  username: string = "";
  password: string = "";
  type: string = "";
  is_disabled: boolean = false;
  photo_url: string = "";
  google_account_id: string = "";
}
