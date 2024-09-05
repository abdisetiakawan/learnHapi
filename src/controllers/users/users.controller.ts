import { Repository, DataSource } from "typeorm";
import { UserEntity } from "../../db/entites";
import { ResponseToolkit, ServerRoute, Request } from "@hapi/hapi";

export const userController = (con: DataSource): Array<ServerRoute> => {
  const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
  return [
    {
      method: "GET",
      path: "/users",
      handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
        const users = await userRepo.find();
        return h.response(users).code(200);
      },
    },
    {
      method: "GET",
      path: "/users/{id}", // GET /users/1
      handler: ({ params: { id } }: Request, h: ResponseToolkit, err?: Error) =>
        userRepo.findOne(id),
    },
  ];
};
