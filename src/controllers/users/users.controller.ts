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
        let { perPage, page, ...q } = query;
        let realPage: number;
        let realTake: number;

        if (perPage) realTake = +perPage;
        else {
          perPage = "10";
          realTake = 10;
        }

        if (page) realPage = +page === 1 ? 0 : (+page - 1) * realTake;
        else {
          realPage = 0;
          page = "1";
        }

        const findOptions = {
          take: realTake,
          skip: realPage,
          where: { ...q },
        };
        if (!Object.keys(q).length) delete findOptions.where;

        // Fungsi untuk membentuk query string
        const getQuery = () => {
          return Object.keys(q)
            .map((key: string) => `${key}=${q[key]}`)
            .join("&");
        };

        const qp = getQuery().length === 0 ? "" : `&${getQuery()}`;

        return {
          data: await userRepo.find(findOptions),
          perPage: realTake,
          page: +page || 1,
          next: `http://localhost:3000/users?perPage=${realTake}&page=${
            +page + 1
          }${qp}`,
          prev:
            +page > 1
              ? `http://localhost:3000/users?perPage=${realTake}&page=${
                  +page - 1
                }${qp}`
              : null, // Tidak memberikan link jika di page pertama
        };
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
