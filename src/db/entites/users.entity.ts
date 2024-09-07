import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SharedProp } from "./sharedProp.entity";
import { PostsEntity } from "./posts.entity";
export type UserType = "admin" | "user";
@Entity({ name: "users" })
export class UserEntity extends SharedProp {
  constructor(
    firstName: string,
    lastName: string,
    birthOfDate: Date,
    email: string,
    salt: string,
    password: string,
    type: UserType
  ) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthOfDate = birthOfDate;
    this.email = email;
    (this.salt = salt), (this.password = password);
    this.type = type;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name", nullable: false })
  firstName: string;

  @Column({ name: "last_name", nullable: false })
  lastName: string;

  @Column({ name: "birth_of_date", nullable: true })
  birthOfDate: Date;

  @Column({ name: "email", unique: true, nullable: false })
  email: string;

  @Column({ default: "user" })
  type: UserType;

  @Column({ nullable: false })
  salt: string;
  @Column({ nullable: false })
  password: string;

  @OneToMany(() => PostsEntity, (post: PostsEntity) => post.user, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  posts: Array<PostsEntity>;
}
