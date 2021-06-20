export interface IMessageArgs {
  to: string;
  content: string;
}

export interface IAudioMessageArgs {
  to: string;
  file: any;
}

export interface IMessage {
  to: string;
  content: string;
  from: string;
}

export interface IReactionArgs {
  messageId: string;
  content: string;
}
