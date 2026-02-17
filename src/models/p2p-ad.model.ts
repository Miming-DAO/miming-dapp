export class P2pAd {
  id: string = "";
  user_id: string = "";
  type: 'buy' | 'sell' = 'buy';
  ordering_type: 'buy' | 'sell' = 'buy';
  p2p_number: string = "";
  logo_url: string = "";
  name: string = "";
  token_symbol: string = "";
  price: number = 0;
  min_limit: number = 0;
  max_limit: number = 0;
  payment_instructions: string = "";
  total_orders: number = 0;
  completed_orders: number = 0;
  status: string = "";
  created_at: Date = new Date();
  updated_at: Date = new Date();
}

export class CreateP2pAdDto {
  user_id: string = "";
  type: 'buy' | 'sell' = 'buy';
  logo_url: string = "";
  name: string = "";
  token_symbol: string = "";
  price: number = 0;
  min_limit: number = 0;
  max_limit: number = 0;
  payment_instructions: string = "";
}

export class UpdateP2pAdDto {
  user_id?: string = "";
  type?: 'buy' | 'sell' = 'buy';
  logo_url?: string = "";
  name?: string = "";
  token_symbol?: string = "";
  price?: number = 0;
  min_limit?: number = 0;
  max_limit?: number = 0;
  payment_instructions?: string = "";
}
