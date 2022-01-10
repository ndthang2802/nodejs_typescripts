import { User } from "../entities/user.entity";
import { IUserCreate, IUserDelete, IUserLogin, IUserRespond, IUserTokenPayload } from "../interfaces/user.interface";

export class UserCreate implements IUserCreate {
    constructor(
        public username: string,
        public password: string,
        public full_name: string,
        public phone : string
    ){}
}

export class UserTokenPayload implements IUserTokenPayload {
    
    public id : string;
    public username : string;
    public full_name : string;
    public phone : string;

    constructor(user : User) {
        this.id = user.id;
        this.username = user.username;
        this.full_name = user.full_name;
        this.phone = user.phone_number;
    }
    
}


export class UserLogin implements IUserLogin {
    constructor(
        public username : string,
        public password : string
    ){}
}

export class UserDelete implements IUserDelete {
    constructor(
        public id : string
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