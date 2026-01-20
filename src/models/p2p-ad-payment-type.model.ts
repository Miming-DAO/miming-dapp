import { P2pAd } from "./p2p-ad.model";
import { P2pPaymentType } from "./p2p-payment-type.model";

export interface P2pAdPaymentType {
  id: string;
  p2p_ad_id: string;
  p2p_ad: P2pAd | null;
  p2p_payment_type_id: string;
  p2p_payment_type: P2pPaymentType | null;
  account_name: string;
  account_number: string;
  attachments: string[];
  other_details: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateP2pAdPaymentTypeDto {
  p2p_ad_id: string;
  p2p_payment_type_id: string;
  account_name: string;
  account_number: string;
  attachments: string[];
  other_details: string;
}

export interface UpdateP2pAdPaymentTypeDto {
  p2p_ad_id?: string;
  p2p_payment_type_id?: string;
  account_name?: string;
  account_number?: string;
  attachments?: string[];
  other_details?: string;
}
