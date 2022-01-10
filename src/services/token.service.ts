import { UserTokenPayload } from "../model/user.model";
import Jwt, { JwtPayload } from 'jsonwebtoken';
import { Token } from "../model/token.model";
import { UserRepository } from "../repository/user.repository";
import { getConnection } from "typeorm";

export class TokenService {
    private access_key : string;
    private refresh_key : string;
    private access_token_expired_time : string;
    private refresh_token_expired_time : string;
    private user_repo : UserRepository;


    constructor(){
        this.access_key = process.env.JWT_KEY_ACCESS || "thisisverysecret_access";
        this.refresh_key = process.env.JWT_KEY_ACCESS || "thisisverysecret_refresh";
        this.access_token_expired_time = process.env.JWT_ACCESS_TOKEN_EXPIRED_TIME || '1200' ;
        this.access_token_expired_time = process.env.JWT_REFRESH_TOKEN_EXPIRED_TIME || '604800' ;
        this.user_repo = getConnection('sales').getCustomRepository(UserRepository);
    }

    public generateToken = (payload : UserTokenPayload, access_token_expiredIn = this.access_token_expired_time, refresh_token_expiredIn = this.refresh_token_expired_time ) : Token  => {
        const access_token = Jwt.sign(
            {
                id : payload.id,
                username : payload.username,
                full_name : payload.full_name,
                phone : payload.phone
            },
            this.access_key,
            {
                expiresIn : parseInt(access_token_expiredIn)
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
                expiresIn : parseInt(refresh_token_expiredIn)
            }
        );
        return new Token(access_token, refresh_token)
    }

    public verify_access = async (access_token : string) => {
        try {
            const decoded = Jwt.verify(access_token, this.access_key);
            var payload = decoded as JwtPayload;
            
            var _user = await this.user_repo.find({
                where : {
                    id : payload.id
                }
            });

            if (! _user.length || !_user[0].access_token) {
                throw new Error('Verify Access Token failed')
            }

            return decoded
          } catch (err) {
            if (err instanceof Error){
                throw new Error(err.message);
            }
            else {
                throw new Error('Invalid Token')
            }
          }

    }

    private verify_refresh = (refresh_token : string) => {
        try {
            const decoded = Jwt.verify(refresh_token, this.refresh_key);
            return decoded
          } catch (err) {
            if (err instanceof Error){
                throw new Error(err.message);
            }
            else {
                throw new Error('Invalid Token')
            }
          }

    }

    private get_payload_from_expired_token = (expired_access_token : string) => {
        try {
            const decoded = Jwt.verify(expired_access_token, this.access_key, {ignoreExpiration: true});
            return decoded;
          } catch (err) {
            console.log(err);
            throw new Error('Invalid token')
          }
    }

    public refresh_token = async (token : Token) : Promise<Token> => {
        try {
            const expired_token = token.access_token;
            const refresh_token = token.refresh_token;

            var payload_from_expired = this.get_payload_from_expired_token(expired_token) as JwtPayload;

            var _user = await this.user_repo.find({
                where : {
                    id : payload_from_expired.id
                }
            });

            if (! _user.length) {
                throw new Error('Refresh Token invalid')
            }

            else {

                if (refresh_token != _user[0].refresh_token) {
                    throw new Error('Refresh Token not match')
                }

                var expired_time = _user[0].refresh_token_expired_day.getTime();
                
                var _now =  new Date().getTime();
    
                if (!expired_time ||  _now - expired_time) {
                    throw new Error('Token expired')
                }
    
                var payload_from_refresh =  this.verify_refresh(refresh_token) as JwtPayload;
    
                if ( !(payload_from_expired.id === payload_from_refresh.id) && !(payload_from_expired.username === payload_from_refresh.username)){
                    throw new Error("Invalid Refresh Token")
                }
    
                var token_respond = this.generateToken(new UserTokenPayload(_user[0]),this.access_token_expired_time, (expired_time - _now).toString() );

                _user[0].access_token = token_respond.access_token;
                _user[0].refresh_token = token_respond.refresh_token;

                return token_respond

            }
        }
        catch (err) {
            if (err instanceof Error){
                throw new Error(err.message);
            }
            else {
                throw new Error()
            }
        }
    }

}