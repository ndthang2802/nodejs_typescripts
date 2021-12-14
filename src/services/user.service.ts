import {getConnection} from 'typeorm';
import { User } from '../entities/user.entity';
import { UserCreate } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";

export class UserService {
    private user_repo : UserRepository;

    constructor(){
        this.user_repo = getConnection('sales').getCustomRepository(UserRepository);
    }
    

    public findByUsername = async (username : string) => {

        try {
            const user = await this.user_repo.find({
                where : {
                    username : username,
                }
            });
            if(user){
                return user;
            }
            return null;
        }
        catch {
            throw new Error('Database query error')
        }

        
    }
    public hashPassword  = async (password : string) => {
        var pw = await bcrypt.hash(password,10);
        return pw
    }

    public create = async (user : UserCreate) => {
        try {
            var _user = await this.findByUsername(user.username);
            if( _user ){
                throw new Error('Username taken')
            }

            var new_user = new User();

            new_user.id = uuidv4();
            new_user.username = user.username;
            new_user.password = await this.hashPassword(user.password);
            new_user.full_name = user.full_name;
            new_user.phone_number = user.phone;
            new_user.created_at =  new Date()
            const user_respond = await this.user_repo.save(new_user);
            return user_respond;

        }
        catch (error) {
            throw new Error()
        }
    }
}