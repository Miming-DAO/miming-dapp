export interface P2pOrder {
  id: string | number;
  ads_id: string | number;
  order_number: string;
  user_id: string | number;
  ordered_price: number;
  amount: number;
  ads_payment_id: string | number;
  status: string;
}

export interface CreateP2pOrderDto {
  ads_id: string | number;
  order_number: string;
  user_id: string | number;
  ordered_price: number;
  amount: number;
  ads_payment_id: string | number;
  status: string;
}

export interface UpdateP2pOrderDto {
  ads_id?: string | number;
  order_number?: string;
  user_id?: string | number;
  ordered_price?: number;
  amount?: number;
  ads_payment_id?: string | number;
  status?: string;
}
