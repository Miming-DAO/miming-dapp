export interface P2pAdPaymentType {
  id: string;
  p2p_ad_id: string;
  p2p_payment_type_id: string;
  name: string;
  description: string;
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
  name: string;
  description: string;
  account_name: string;
  account_number: string;
  attachments: string[];
  other_details: string;
}

export interface UpdateP2pAdPaymentTypeDto {
  p2p_ad_id?: string;
  p2p_payment_type_id?: string;
  name?: string;
  description?: string;
  account_name?: string;
  account_number?: string;
  attachments?: string[];
  other_details?: string;
}
