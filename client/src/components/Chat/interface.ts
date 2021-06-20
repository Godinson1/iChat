export interface IUser {
  messages: Array<any>;
  username: string;
  photoUrl: string;
  createdAt: string;
  selected: boolean;
  lastMessage: {
    content: string;
    createdAt: string;
    from: string;
    messageId: string;
    to: string;
  };
}

export interface IMessage {
  to: string;
  content: string;
  from: string;
  messageId: string;
  createdAt: string;
}

export interface ICurrentChat {
  contactRecipient: string;
  contactRecipientPhotoUrl: string;
  lastMessage: {
    createdAt: string;
  };
}

export interface IChatMessages {
  loading: boolean;
  selectedContact: {
    contactRecipient: string;
    createdAt: string;
  };
  activeContactMessages: Array<IMessage>;
}

export interface IChatHeaderFooter {
  selectedContact: {
    contactRecipient: string;
    contactRecipientPhotoUrl?: string;
    createdAt: string;
  };
}

export interface IChatAudio {
  handleAudioUpload: Function;
  setAudioState: Function;
  selectedContact: { contactRecipient: string };
  audioState: {
    audioDetails: {
      url: string;
      blob: Blob | null;
      chunks: Array<unknown>;
      duration: {
        h: number;
        m: number;
        s: number;
      };
    };
  };
}
