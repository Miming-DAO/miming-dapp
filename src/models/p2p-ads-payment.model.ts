export interface P2pAdsPayment {
  id: string | number;
  p2p_ad_id: string | number;
  payment_type_id: string | number;
  name: string;
  description: string;
  account_name: string;
  account_number: string;
  attachments: string[];
  other_details: string;
}

export interface CreateP2pAdsPaymentDto {
  p2p_ad_id: string | number;
  payment_type_id: string | number;
  name: string;
  description: string;
  account_name: string;
  account_number: string;
  attachments: string[];
  other_details: string;
}

export interface UpdateP2pAdsPaymentDto {
  p2p_ad_id?: string | number;
  payment_type_id?: string | number;
  name?: string;
  description?: string;
  account_name?: string;
  account_number?: string;
  attachments?: string[];
  other_details?: string;
}
