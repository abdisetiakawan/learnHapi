import { DataSource } from "typeorm";
import "reflect-metadata";
import { UserEntity, PostsEntity } from "./entites";
import "colors";
import { fakeUsers, fakePosts } from "../fakeData";
export const initDB = async (): Promise<DataSource> => {
  const entities = [UserEntity, PostsEntity];
  const fakeFuncs = [fakeUsers, fakePosts];
  const dataSource = new DataSource({
    type: "sqlite",
    database: "./hapi.db",
    synchronize: true,
    entities,
    logger: "advanced-console",
    logging: true,
  });

  await dataSource.initialize();
  entities.forEach((entity) => console.log(`Created ${entity.name}`.blue));
  // uncomment this if you want to create fake data
  // console.log("Creating fake data...".yellow.bold);
  // for (const fun of fakeFuncs) await fun(dataSource);

  return dataSource;
};
