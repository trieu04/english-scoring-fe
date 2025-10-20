import { BaseEntity } from "./base-entity";

export enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser extends BaseEntity {
  name: string;
  username: string;
  email: string;
  roles: UserRoleEnum[];
}
