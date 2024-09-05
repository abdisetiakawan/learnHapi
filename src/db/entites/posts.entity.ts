import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SharedProp } from "./sharedProp.entity";
import { UserEntity } from "./users.entity";

@Entity({ name: "posts" })
export class PostsEntity extends SharedProp {
  constructor(title: string, body: string, user: UserEntity) {
    super();
    this.title = title;
    this.body = body;
    this.user = user;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  body: string;

  @Column({ name: "user_id", nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.posts)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}
