export interface P2pPaymentType {
  id: string | number;
  name: string;
  type: string;
  logo_url: string;
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
