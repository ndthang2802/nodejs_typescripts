import { IToken } from "../interfaces/token.interface";

export class Token implements IToken {
    public access_token: string;
    public refresh_token: string;

    constructor(accesstoken : string, refreshtoken:string){
        this.access_token = accesstoken;
        this.refresh_token = refreshtoken;
    }
}
