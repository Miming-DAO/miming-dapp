export class P2pPaymentType {
  id: string = "";
  name: string = "";
  type: string = "";
  logo_url: string = "";
  created_at: Date = new Date();
  updated_at: Date = new Date();
}

export class CreateP2pPaymentTypeDto {
  name: string = "";
  type: string = "";
  logo_url: string = "";
}

export class UpdateP2pPaymentTypeDto {
  name?: string = "";
  type?: string = "";
  logo_url?: string = "";
}
