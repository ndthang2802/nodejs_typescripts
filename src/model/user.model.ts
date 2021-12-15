import { User } from "../entities/user.entity";
import { IUserCreate, IUserRespond } from "../interfaces/user.interface";

export class UserCreate implements IUserCreate {
    constructor(
        public username: string,
        public password: string,
        public full_name: string,
        public phone : string
    ){}
}

export class UserRespond implements IUserRespond {
   
    public username: string;
    public full_name: string;
    public phone : string;
    public access_token: string;
    public refresh_token : string;
    

    constructor(user : User) {
        this.username = user.username;
        this.full_name = user.full_name;
        this.phone = user.phone_number;
        this.access_token = user.access_token;
        this.refresh_token = user.refresh_token;
    }
}