import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../../db/entites";
import { genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { string, object, date } from "@hapi/joi";
import { ServerRoute, Request, ResponseToolkit } from "@hapi/hapi";

export const authController = (con: DataSource): Array<ServerRoute> => {
  const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
  return [
    {
      method: "POST",
      path: "/register",
      handler: async ({ payload }: Request, h: ResponseToolkit) => {
        const { firstName, lastName, email, password, birthOfDate, type } =
          payload as Partial<UserEntity>;
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        const user: Partial<UserEntity> = new UserEntity(
          firstName,
          lastName,
          birthOfDate,
          email,
          salt,
          hashedPassword,
          type
        );
        await userRepo.save<Partial<UserEntity>>(user);
        delete user.password;
        delete user.salt;
        return {
          ...user,
          accessToken: sign({ ...user }, "secretKeyharusnyadienv"),
        };
      },
    },
  ];
};
