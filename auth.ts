import { Repository, DataSource } from "typeorm";
import { ResponseToolkit, Request } from "@hapi/hapi";
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
    return { isValid: true };
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
    const isValid = (await compare(password, user.salt)) === user.password;
    delete user.password;
    delete user.salt;

    return { isValid, credentials: user };
  };
};
