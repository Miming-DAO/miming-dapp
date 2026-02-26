export class P2pMessage {
  id: string = "";
  p2p_conversation_id: string = "";
  role: string = "";
  content: string = "";
  attachments: string[] = [];
  created_at: Date = new Date();
  updated_at: Date = new Date();
}
