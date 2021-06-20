export interface IContact {
  contactInitiator: string;
  contactInitiatorPhotoUrl: string;
  contactRecipient: string;
  contactRecipientPhotoUrl: string;
  createdAt: string;
  selected: boolean;
  lastMessage: {
    createdAt: string;
    content: string;
  };
}
