export class Login {
  username: string = "";
  password: string = "";
}

export class TokenResponse {
  access_token: string = "";
  token_type?: string = "";
  expires_in?: number = 0;
}
