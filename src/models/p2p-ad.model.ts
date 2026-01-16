export interface P2pAd {
  id: string | number;
  user_id: string | number;
  p2p_number: string;
  logo_url: string;
  name: string;
  token_id: string | number;
  price: number;
  payment_types: string[];
  available_amount: number;
  limit_from: number;
  limit_to: number;
  status: string;
}

export interface CreateP2pAdDto {
  user_id: string | number;
  p2p_number: string;
  logo_url: string;
  name: string;
  token_id: string | number;
  price: number;
  payment_types: string[];
  available_amount: number;
  limit_from: number;
  limit_to: number;
  status: string;
}

export interface UpdateP2pAdDto {
  user_id?: string | number;
  p2p_number?: string;
  logo_url?: string;
  name?: string;
  token_id?: string | number;
  price?: number;
  payment_types?: string[];
  available_amount?: number;
  limit_from?: number;
  limit_to?: number;
  status?: string;
}
