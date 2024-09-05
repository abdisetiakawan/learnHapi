import { faker } from "@faker-js/faker";
import { Condition, Repository, DataSource } from "typeorm";
import { UserEntity, UserType } from "../db/entites/users.entity";
import "colors";
import { get } from "node-emoji";

export const fakeUsers = async (con: DataSource, amount: number = 10) => {
  const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
  for (const _ of Array.from({ length: amount })) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthOfDate = faker.date.birthdate();
    const email = faker.internet.email();
    const type: UserType = faker.helpers.arrayElement(["admin", "user"]);
    const u: Partial<UserEntity> = new UserEntity(
      firstName,
      lastName,
      birthOfDate,
      email,
      type
    );
    await userRepo.save<Partial<UserEntity>>(u);
  }
  const emoji = get("white_check_mark");
  console.log(`${emoji} ${amount} fake users created`.green);
};
