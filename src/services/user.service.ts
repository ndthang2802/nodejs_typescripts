import {getConnection} from 'typeorm';
import { UserCreate, UserRespond } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";

export class UserService {
    private user_repo : UserRepository;

    constructor(){
        this.user_repo = getConnection('sales').getCustomRepository(UserRepository);
    }
    

    private hashPassword  = async (password : string) => {
        var pw = await bcrypt.hash(password,10);
        return pw
    }

    private comparePassword = async (password : string, passwordHash : string ) : Promise<boolean> => {
        if ( password === passwordHash){
            return true;
        }
        return false;
    }

    public findByUsername = async (username : string) => {

        try {
            const user = await this.user_repo.find({
                where : {
                    username : username,
                }
            });
            if(user.length){
                return user;
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
        catch (error) {
            throw new Error()
        }
    }

    
}