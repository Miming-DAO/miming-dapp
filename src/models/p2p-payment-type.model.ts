export interface P2pPaymentType {
  id: string;
  name: string;
  type: string;
  logo_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateP2pPaymentTypeDto {
  name: string;
  type: string;
  logo_url: string;
}

export interface UpdateP2pPaymentTypeDto {
  name?: string;
  type?: string;
  logo_url?: string;
}
