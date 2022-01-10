import {DeleteResult, getConnection} from 'typeorm';
import { UserCreate, UserLogin, UserRespond, UserTokenPayload } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";
import { TokenService } from './token.service';
import { UserDelete } from '../model/user.model';

export class UserService {
    private user_repo : UserRepository;
    private token_service : TokenService;

    constructor(){
        this.user_repo = getConnection('sales').getCustomRepository(UserRepository);
        this.token_service = new TokenService()
    }
    

    private hashPassword  = async (password : string) => {
        var pw = await bcrypt.hash(password,10);
        return pw
    }

    private comparePassword = async (password : string, passwordHash : string ) : Promise<boolean> => {
        const match = await bcrypt.compare(password, passwordHash);
        return match
    }

    public findByUsername = async (username : string) => {

        try {
            const user = await this.user_repo.find({
                where : {
                    username : username,
                }
            });
            if(user.length){
                return user[0];
            }
            return null;
        }
        catch {
            throw new Error('Database query error')
        }        
    }

    public findById = async (id : string) => {

        try {
            const user = await this.user_repo.find({
                where : {
                    id : id,
                }
            });
            if(user.length){
                return user[0];
            }
            return null;
        }
        catch {
            throw new Error('Database query error')
        }        
    }

    public  create = async (user : UserCreate)  : Promise<UserRespond> => {
        try {
            var _user = await this.findByUsername(user.username);
            if( _user ){
                throw new Error('Username taken')
            }

            const user_saving = await this.user_repo.save({
                id : uuidv4(),
                username : user.username,
                password : await this.hashPassword(user.password),
                full_name : user.full_name,
                phone_number : user.phone,
                created_at :  new Date(),
                access_token : "",
                refresh_token : ""
            });

            const user_respond = new UserRespond(user_saving);

            return user_respond;

        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message);
            }
            else {
                throw new Error()
            }
        }
    }


    public login = async (user : UserLogin) : Promise<UserRespond> => {
        try {
            var _user = await this.findByUsername(user.username);

            if( !_user ){
                throw new Error("Username not exist")
            }

            const password_match = await this.comparePassword(user.password, _user.password);

            if ( !password_match ) {
                throw new Error('Incorect password');
            }

            const tokens = this.token_service.generateToken(new UserTokenPayload(_user));

            _user.access_token = tokens.access_token;
            _user.refresh_token = tokens.refresh_token;
            _user.refresh_token_expired_day = new Date(60*60*24*7)

            return new UserRespond(_user);


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
    public delete = async (user : UserDelete) : Promise<DeleteResult> => {
        try {
            const result = await this.user_repo.delete(user.id)
            return result
        }
        catch (err){
            if (err instanceof Error){
                throw new Error(err.message);
            }
            else {
                throw new Error()
            }
        }
    }

    public getRefreshTokenAndExpiredTime = async (userId : string)  => {
        try {
            const user = await this.user_repo.find({ 
                where : { 
                    id : userId
                }
            });
            
            if (user.length) {
                return user[0].refresh_token , user[0].refresh_token_expired_day.getTime();
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

    //public revoke = async (user : Us):


    
}