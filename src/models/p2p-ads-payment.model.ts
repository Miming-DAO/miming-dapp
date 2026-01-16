export interface P2pAdsPayment {
  id: string | number;
  payment_type_id: string | number;
  name: string;
  description: string;
  account_name: string;
  account_number: string;
  attachments: string[];
  other_details: string;
}

export interface CreateP2pAdsPaymentDto {
  payment_type_id: string | number;
  name: string;
  description: string;
  account_name: string;
  account_number: string;
  attachments: string[];
  other_details: string;
}

export interface UpdateP2pAdsPaymentDto {
  payment_type_id?: string | number;
  name?: string;
  description?: string;
  account_name?: string;
  account_number?: string;
  attachments?: string[];
  other_details?: string;
}
