export interface IUser {
  id: number;
  email: string;
  password: string;
  photoUrl: string;
  username: string;
  lastMessage: any;
}

export interface IRegArgs {
  username: string;
  email: string;
  password: string;
}

export interface IDecodedToken {
  id: number;
  username: string;
  email: string;
  photoUrl: string;
  iat: number;
  exp: number;
}
