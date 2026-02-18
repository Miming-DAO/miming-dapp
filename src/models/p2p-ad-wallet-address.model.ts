import { P2pAd } from "./p2p-ad.model";

export class P2pAdWalletAddress {
  id: string = "";
  p2p_ad_id: string = "";
  p2p_ad: P2pAd | undefined;
  wallet_name: string = "";
  wallet_address: string = "";
  attachments: string[] = [];
  other_details: string = "";
  created_at: Date = new Date();
  updated_at: Date = new Date();
}

export class CreateP2pAdWalletAddressDto {
  p2p_ad_id: string = "";
  wallet_name: string = "";
  wallet_address: string = "";
  attachments: string[] = [];
  other_details: string = "";
}

export class UpdateP2pAdWalletAddressDto {
  p2p_ad_id?: string = "";
  wallet_name?: string = "";
  wallet_address?: string = "";
  attachments?: string[] = [];
  other_details?: string = "";
}
