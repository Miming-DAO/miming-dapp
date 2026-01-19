export interface P2pOrder {
  id: string;
  p2p_ad_id: string;
  order_number: string;
  user_id: string;
  ordered_price: number;
  amount: number;
  p2p_payment_type_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateP2pOrderDto {
  p2p_ad_id: string;
  order_number: string;
  user_id: string;
  ordered_price: number;
  amount: number;
  p2p_payment_type_id: string;
  status: string;
}

export interface UpdateP2pOrderDto {
  p2p_ad_id?: string;
  order_number?: string;
  user_id?: string;
  ordered_price?: number;
  amount?: number;
  p2p_payment_type_id?: string;
  status?: string;
}
