import { Repository, DataSource } from "typeorm";
import { UserEntity } from "../../db/entites";
import * as bcrypt from "bcrypt";
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
        const totalData = await userRepo.count({ where: { ...q } });
        const totalPages = Math.ceil(totalData / realTake);
        const data = await userRepo.find(findOptions);

        return {
          data: data.map((u: UserEntity) => {
            delete u.password;
            delete u.salt;
            return u;
          }),
          perPage: realTake,
          page: +page || 1,
          next:
            +page < totalPages
              ? `http://localhost:3000/users?perPage=${realTake}&page=${
                  +page + 1
                }${qp}`
              : null,
          prev:
            +page > 1
              ? `http://localhost:3000/users?perPage=${realTake}&page=${
                  +page - 1
                }${qp}`
              : null, // Tidak memberikan link jika di page pertama
        };
      },
      options: {
        auth: {
          strategy: "jwt",
        },
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
        delete user.password;
        delete user.salt;

        if (!user) {
          return h.response({ message: "User not found" }).code(404);
        }

        return h.response(user).code(200);
      },
      options: {
        auth: {
          strategy: "jwt",
        },
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
        const { firstName, lastName, birthOfDate, email, password, type } =
          payload as Partial<UserEntity>;

        // Validasi apakah password ada di payload
        if (!password) {
          return h.response({ message: "Password is required" }).code(400);
        }

        // Menghasilkan salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(password, salt);

        // Membuat objek UserEntity
        const u: Partial<UserEntity> = new UserEntity(
          firstName,
          lastName,
          birthOfDate,
          email,
          salt,
          hashedPassword,
          type
        );

        // Menyimpan user ke dalam database
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
        delete user.password;
        delete user.salt;

        return h.response(user).code(200);
      },
      options: {
        auth: {
          strategy: "jwt",
        },
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
        delete user.password;
        delete user.salt;

        // Kembalikan respons dengan data user yang dihapus
        return h
          .response({ message: "User deleted successfully", user })
          .code(200);
      },
      options: {
        auth: {
          strategy: "jwt",
        },
      },
    },
  ];
};
