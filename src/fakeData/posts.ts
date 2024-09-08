import { faker } from "@faker-js/faker";
import { Repository, DataSource } from "typeorm";
import { PostsEntity, UserEntity } from "../db/entites";
import "colors";

export const fakePosts = async (con: DataSource, amount: number = 50) => {
  const postRepo: Repository<PostsEntity> = con.getRepository(PostsEntity);
  const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
  const users: Array<UserEntity> = await userRepo.find();
  for (const user of users) {
    const shouldWeCreate: boolean = faker.helpers.arrayElement([false, true]);
    if (shouldWeCreate) {
      const title = faker.lorem.sentence();
      const body = faker.lorem.paragraph();
      const title2 = faker.lorem.sentence();
      const body2 = faker.lorem.paragraph();
      const post: Partial<PostsEntity> = new PostsEntity(title, body, user.id);
      const post2: Partial<PostsEntity> = new PostsEntity(
        title2,
        body2,
        user.id
      );

      await postRepo.save<Partial<PostsEntity>>(post);
      await postRepo.save<Partial<PostsEntity>>(post2);
    }
  }
};
