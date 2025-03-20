export enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  id: number;
  email: string;
  role: UserRoleEnum;
  image: string;
  imageUrl: string;
  imageProvider: string;
  name: string;
}
