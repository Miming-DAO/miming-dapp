import { P2pAd } from "./p2p-ad.model";
import { P2pPaymentType } from "./p2p-payment-type.model";

export class P2pAdPaymentType {
  id: string = "";
  p2p_ad_id: string = "";
  p2p_ad: P2pAd | undefined;
  p2p_payment_type_id: string = "";
  p2p_payment_type: P2pPaymentType | undefined;
  account_name: string = "";
  account_number: string = "";
  attachments: string[] = [];
  other_details: string = "";
  created_at: Date = new Date();
  updated_at: Date = new Date();
}

export class CreateP2pAdPaymentTypeDto {
  p2p_ad_id: string = "";
  p2p_payment_type_id: string = "";
  account_name: string = "";
  account_number: string = "";
  attachments: string[] = [];
  other_details: string = "";
}

export class UpdateP2pAdPaymentTypeDto {
  p2p_ad_id?: string = "";
  p2p_payment_type_id?: string = "";
  account_name?: string = "";
  account_number?: string = "";
  attachments?: string[] = [];
  other_details?: string = "";
}
