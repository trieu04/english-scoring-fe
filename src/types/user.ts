export enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  roles: UserRoleEnum[];
}
