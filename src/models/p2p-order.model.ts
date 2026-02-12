import { P2pAd } from "./p2p-ad.model";
import { P2pPaymentType } from "./p2p-payment-type.model";
import { User } from "./user.model";

export class P2pOrder {
  id: string = "";
  p2p_ad_id: string = "";
  p2p_ad: P2pAd | undefined;
  order_number: string = "";
  order_type: string = "";
  ordered_price: number = 0;
  quantity: number = 0;
  amount: number = 0;
  p2p_payment_type_id: string = "";
  p2p_payment_type: P2pPaymentType | undefined;
  ordered_by_user_id: string = "";
  ordered_by_user: User | undefined;
  status: string = "";
  created_at: Date = new Date();
  updated_at: Date = new Date();
}

export class CreateP2pOrderDto {
  p2p_ad_id: string = "";
  order_type: string = "";
  ordered_price: number = 0;
  quantity: number = 0;
  amount: number = 0;
  p2p_payment_type_id: string = "";
  ordered_by_user_id: string = "";
}

export class UpdateP2pOrderDto {
  p2p_ad_id?: string = "";
  order_number?: string = "";
  user_id?: string = "";
  ordered_price?: number = 0;
  amount?: number = 0;
  p2p_payment_type_id?: string = "";
  ordered_by_user_id: string = "";
  status?: string;
}
