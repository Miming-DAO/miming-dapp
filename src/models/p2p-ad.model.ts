export interface P2pAd {
  id: string | number;
  user_id: string | number;
  type: 'buy' | 'sell';
  p2p_number: string;
  logo_url: string;
  name: string;
  token_id: string | number;
  price: number;
  available_amount: number;
  limit_from: number;
  limit_to: number;
  payment_instructions: string;
  status: string;
}

export interface CreateP2pAdDto {
  user_id: string | number;
  type: 'buy' | 'sell';
  p2p_number: string;
  logo_url: string;
  name: string;
  token_id: string | number;
  price: number;
  available_amount: number;
  limit_from: number;
  limit_to: number;
  payment_instructions: string;
  status: string;
}

export interface UpdateP2pAdDto {
  user_id?: string | number;
  type: 'buy' | 'sell';
  p2p_number?: string;
  logo_url?: string;
  name?: string;
  token_id?: string | number;
  price?: number;
  available_amount?: number;
  limit_from?: number;
  limit_to?: number;
  payment_instructions?: string;
  status?: string;
}
