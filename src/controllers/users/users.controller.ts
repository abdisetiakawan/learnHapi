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
      handler: async (
        { params: { id } }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const user = await userRepo.findOne({
          where: { id: Number(id) },
        });

        if (!user) {
          return h.response({ message: "User not found" }).code(404);
        }

        return h.response(user).code(200);
      },
    },
    {
      method: "POST",
      path: "/users",
      handler: async (
        { payload }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const { firstName, lastName, birthOfDate, email, type } =
          payload as Partial<UserEntity>;
        const u: Partial<UserEntity> = new UserEntity(
          firstName,
          lastName,
          birthOfDate,
          email,
          type
        );
        return h.response(await userRepo.save(u)).code(201);
      },
    },
  ];
};
