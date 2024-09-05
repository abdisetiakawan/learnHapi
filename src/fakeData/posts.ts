import {faker} from '@faker-js/faker';
import {Repository, DataSource} from 'typeorm';
import {PostsEntity, UserEntity} from '../db/entites';
import 'colors';
import {get} from 'node-emoji'

export const fakePosts = async (con: DataSource, amount: number = 10) => {
    const postRepo: Repository<PostsEntity> = con.getRepository(PostsEntity);
    const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
    const users: Array<UserEntity> = await userRepo.find();
    for (const user of users) {
        const shouldWeCreate : boolean = faker.helpers.
    }