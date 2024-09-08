import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../../db/entites";
import { genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import * as Joi from "joi";
import { ServerRoute, Request, ResponseToolkit } from "@hapi/hapi";

export const authController = (con: DataSource): Array<ServerRoute> => {
  const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
  return [
    {
      method: "POST",
      path: "/login",
      handler: async (
        { payload, auth: { credentials } }: Request,
        h: ResponseToolkit
      ) => {
        return {...credentials, accessToken: sign({ ...credentials }, "secretKeyharusnyadienv")};
      },
      options: {
        auth: {
          strategy: "simple",
        },
      },
    },
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
      options: {
        auth: false,
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required().min(4).max(255),
            lastName: Joi.string().required().min(4).max(255),
            email: Joi.string().email().required().email(),
            password: Joi.string()
              .pattern(
                new RegExp(
                  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
                )
              )
              .required()
              .messages({
                "string.pattern.base":
                  "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
              }),
            birthOfDate: Joi.date().optional().max("2010-01-01"),
            type: Joi.string().required(),
          }),
          failAction(request: Request, h: ResponseToolkit, err: Error) {
            throw err;
          },
          options: {
            abortEarly: false,
          },
        },
      },
    },
  ];
};
