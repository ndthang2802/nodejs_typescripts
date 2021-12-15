import {Router, Request, Response} from 'express';
import { User } from '../entities/user.entity';
import { UserCreate } from '../model/user.model';
import { UserService } from '../services/user.service';

export class UserController {
    public router : Router;
    private user_service : UserService;

    constructor() {
        this.router = Router();
        this.user_service = new UserService();
        this.routes();
    }

    public index(req:Request,res:Response){
        res.send('User index');
    }

    public create = async (req:Request,res:Response) => {
        const user_req = req['body'] as UserCreate;
        try {
            const new_user =  await this.user_service.create(user_req);
            res.send(new_user);
        }   
        catch (error){
            res.send('error')
        }

    }
    public delete(req:Request,res:Response){
        res.send('User delete');
    }
    public update(req:Request,res:Response){
        res.send('User update');
    }    
    public routes() {
        this.router.get("/",this.index);
        this.router.post('/create',this.create);
        this.router.put('/update',this.update);
        this.router.delete('/delete',this.delete);
    }
}