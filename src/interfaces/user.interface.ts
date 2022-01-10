export interface IUserCreate {
    username : string;
    password : string;
    full_name : string;
    phone : string;
}


export interface IUserTokenPayload {
    id : string;
    username : string;
    full_name : string;
    phone : string;
}
export interface IUserRespond {
    username : string;
    full_name : string;
    phone : string;
    access_token : string;
    refresh_token : string;
}


export interface IUserLogin {
    username : string;
    password : string;
}


export interface IUserDelete {
    id : string;
}