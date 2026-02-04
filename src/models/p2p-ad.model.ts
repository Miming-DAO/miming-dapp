export interface P2pAd {
  id: string
  user_id: string;
  type: 'buy' | 'sell';
  p2p_number: string;
  logo_url: string;
  name: string;
  token_symbol: string;
  price: number;
  available_amount: number;
  min_limit: number;
  max_limit: number;
  payment_instructions: string;
  total_orders: number;
  completed_orders: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateP2pAdDto {
  type: 'buy' | 'sell';
  logo_url: string;
  name: string;
  token_symbol: string;
  price: number;
  available_amount: number;
  min_limit: number;
  max_limit: number;
  payment_instructions: string;
}

export interface UpdateP2pAdDto {
  type?: 'buy' | 'sell';
  logo_url?: string;
  name?: string;
  token_symbol?: string;
  price?: number;
  available_amount?: number;
  min_limit?: number;
  max_limit?: number;
  payment_instructions?: string;
}
