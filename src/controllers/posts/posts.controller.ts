import { DataSource, Repository } from "typeorm";
import { ServerRoute, ResponseToolkit, Request } from "@hapi/hapi";
import { PostsEntity, UserEntity } from "../../db/entites";

export const postsController = (con: DataSource): Array<ServerRoute> => {
  const postRepo: Repository<PostsEntity> = con.getRepository(PostsEntity);
  const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
  return [
    {
      method: "POST",
      path: "/posts",
      handler: async (
        {
          payload,
          auth: {
            credentials: { user },
          },
        }: Request,
        h: ResponseToolkit
      ) => {
        const { title, body } = payload as Partial<PostsEntity>;
        const p: Partial<PostsEntity> = new PostsEntity(
          title,
          body,
          (user as UserEntity).id
        );
        return await postRepo.save<Partial<PostsEntity>>(p);
      },
      options: {
        auth: {
          strategy: "jwt",
        },
      },
    },
  ];
};
