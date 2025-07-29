export interface QuickReply {
  text: string;
  value: string;
  emoji?: string;
}

export interface ActionButton {
  text: string;
  value: string;
  type?: "primary" | "secondary";
  emoji?: string;
}

export interface RichCard {
  title: string;
  description: string;
  imageUrl?: string;
  actions?: ActionButton[];
}

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  quickReplies?: QuickReply[];
  richCard?: RichCard;
  timestamp?: Date;
}

export type MessageType = "text" | "quickReplies" | "richCard" | "mixed"; 