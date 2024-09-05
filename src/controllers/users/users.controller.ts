import { Repository, DataSource } from "typeorm";
import { UserEntity } from "../../db/entites";
import { ResponseToolkit, ServerRoute, Request } from "@hapi/hapi";

export const userController = (con: DataSource): Array<ServerRoute> => {
  const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
  return [
    {
      method: "GET",
      path: "/users",
      handler: async ({ query }: Request, h: ResponseToolkit, err?: Error) => {
        const options = { where: { ...query } };
        if (!query) delete options.where;
        const users = await userRepo.find(options);
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
    {
      method: "PATCH",
      path: "/users/{id}",
      handler: async (
        { payload, params: { id } }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const user = await userRepo.findOne({ where: { id: Number(id) } });

        // Jika user tidak ditemukan, kembalikan 404
        if (!user) {
          return h.response({ message: "User not found" }).code(404);
        }

        // Perbarui setiap properti yang ada di payload
        Object.keys(payload).forEach((key: string) => {
          if (user.hasOwnProperty(key)) {
            user[key] = payload[key];
          }
        });

        // Simpan perubahan ke database menggunakan save()
        await userRepo.save(user);

        return h.response(user).code(200);
      },
    },
    {
      method: "DELETE",
      path: "/users/{id}",
      handler: async (
        { params: { id } }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
        const user = await userRepo.findOne({ where: { id: Number(id) } });

        // Jika user tidak ditemukan, kembalikan 404
        if (!user) {
          return h.response({ message: "User not found" }).code(404);
        }

        // Hapus user dan pastikan operasi selesai sebelum melanjutkan
        await userRepo.remove(user);

        // Kembalikan respons dengan data user yang dihapus
        return h
          .response({ message: "User deleted successfully", user })
          .code(200);
      },
    },
  ];
};
