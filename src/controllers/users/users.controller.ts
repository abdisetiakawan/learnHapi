import { Repository, DataSource } from "typeorm";
import { UserEntity } from "../../db/entites";
import {ResponseToolkit, ServerRoute, Request} from '@hapi/hapi'

export const userController = (con: DataSource): Array<ServerRoute> => {
    const userRepo: Repository<UserEntity> = con.getRepository(UserEntity);
    return [
        {
            method: 'GET',
            path: '/users',
            handler: async (request: Request, h: ResponseToolkit) => {
                const users = await userRepo.find();
                return h.response(users).code(200);
            }
        }
    ]
}