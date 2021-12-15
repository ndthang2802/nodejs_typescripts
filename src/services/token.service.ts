import { UserTokenPayload } from "../model/user.model";
import Jwt from 'jsonwebtoken';

export class TokenService {
    private access_key : string;
    private refresh_key : string;

    constructor(){
        this.access_key = process.env.JWT_KEY_ACCESS || "thisisverysecret_access";
        this.refresh_key = process.env.JWT_KEY_ACCESS || "thisisverysecret_refresh";

    }

    public generateToken = (payload : UserTokenPayload)   => {
        const access_token = Jwt.sign(
            {
                id : payload.id,
                username : payload.username,
                full_name : payload.full_name,
                phone : payload.phone
            },
            this.access_key,
            {
                expiresIn : 60*20
            }
        );
        const refresh_token = Jwt.sign(
            {
                id : payload.id,
                username : payload.username,
                full_name : payload.full_name,
                phone : payload.phone
            },
            this.refresh_key,
            {
                expiresIn : 60*60*24*7
            }
        );
        return {access_token, refresh_token}
    }

    public verify_access = (access_token : any) => {
        try {
            const decoded = Jwt.verify(access_token, this.access_key);
            return decoded
          } catch (err) {
            console.log(err);
            throw new Error('Invalid token')
          }

    }

    public verify_refresh = (refresh_token : string) => {
        try {
            const decoded = Jwt.verify(refresh_token, this.refresh_key);
            return decoded
          } catch (err) {
            console.log(err);
            throw new Error('Invalid token')
          }

    }

}