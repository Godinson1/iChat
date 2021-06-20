export interface IContactArgs {
  contactRecipient: string;
}

export interface IContact {
  contactRecipient: string;
  contactInitiator: string;
  contactInitiatorPhotoUrl: string;
  contactRecipientPhotoUrl: string;
  createdAt: string;
  lastMessage: string;
}
