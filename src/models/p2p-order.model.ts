import { P2pAd } from "./p2p-ad.model";
import { P2pPaymentType } from "./p2p-payment-type.model";

export interface P2pOrder {
  id: string;
  p2p_ad_id: string;
  p2p_ad: P2pAd;
  order_number: string;
  ordered_price: number;
  quantity: number;
  amount: number;
  p2p_payment_type_id: string;
  p2p_payment_type: P2pPaymentType;
  wallet_address: string;
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
  wallet_address: string;
  status: string;
}

export interface UpdateP2pOrderDto {
  p2p_ad_id?: string;
  order_number?: string;
  user_id?: string;
  ordered_price?: number;
  amount?: number;
  p2p_payment_type_id?: string;
  wallet_address: string;
  status?: string;
}
