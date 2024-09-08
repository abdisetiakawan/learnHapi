import { Repository, DataSource } from "typeorm";
import { ResponseToolkit, Request, AuthCredentials } from "@hapi/hapi";
import { UserEntity } from "./src/db/entites";
import { compare } from "bcrypt";

export const validateJWT = (con: DataSource) => {
  const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
  return async (
    { id }: Partial<UserEntity>,
    request: Request,
    h: ResponseToolkit
  ) => {
    const user: UserEntity = await userRepo.findOne({
      where: { id },
    });
    if (!user) return { isValid: false };
    const cred = { user } as AuthCredentials;
    return { isValid: true, credentials: cred };
  };
};

export const validateBasic = (con: DataSource) => {
  const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
  return async (
    request: Request,
    username: string,
    password: string,
    h: ResponseToolkit
  ) => {
    const user: UserEntity = await userRepo.findOne({
      where: { email: username },
    });
    if (!user) {
      return { credentials: null, isValid: false };
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      return { credentials: null, isValid: false };
    }
    delete user.password;
    delete user.salt;

    return { isValid, credentials: user };
  };
};
