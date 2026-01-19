export interface P2pAd {
  id: string
  user_id: string;
  type: 'buy' | 'sell';
  p2p_number: string;
  logo_url: string;
  name: string;
  token_id: number;
  price: number;
  available_amount: number;
  limit_from: number;
  limit_to: number;
  payment_instructions: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateP2pAdDto {
  user_id: string;
  type: 'buy' | 'sell';
  p2p_number: string;
  logo_url: string;
  name: string;
  token_id: number;
  price: number;
  available_amount: number;
  limit_from: number;
  limit_to: number;
  payment_instructions: string;
  status: string;
}

export interface UpdateP2pAdDto {
  type: 'buy' | 'sell';
  logo_url: string;
  name: string;
  price: number;
  available_amount: number;
  limit_from: number;
  limit_to: number;
  payment_instructions: string;
}
