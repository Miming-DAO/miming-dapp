export class GenerateNonce {
  wallet_address: string = "";
  wallet_type: string = "polkadot";
}

export class GenerateNonceResponse {
  nonce: string = "";
  message: string = "";
}

export class VerifySignature {
  wallet_name: string = "";
  wallet_address: string = "";
  nonce: string = "";
  signature: string = "";
}

export class VerifySignatureResponse {
  access_token: string = "";
  user: {
    _id: string;
    full_name: string;
    email: string;
    username: string;
    type: string;
    auth_type: string;
    google_account_id: string;
    photo_url: string;
    created_at: Date;
    updated_at: Date;
  } = {
      _id: "",
      full_name: "",
      email: "",
      username: "",
      type: "",
      auth_type: "",
      google_account_id: "",
      photo_url: "",
      created_at: new Date(),
      updated_at: new Date(),
    }
}
