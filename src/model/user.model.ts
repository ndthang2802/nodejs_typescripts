import { IUserCreate } from "../interfaces/user.interface";

export class UserCreate implements IUserCreate {
    constructor(
        public username: string,
        public password: string,
        public full_name: string,
        public phone : string
    ){}
}