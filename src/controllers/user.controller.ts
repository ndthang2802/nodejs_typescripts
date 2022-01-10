import {Router, Request, Response} from 'express';
import { User } from '../entities/user.entity';
import { CustomRequest } from '../interfaces/customRequest.interface';
import { UserCreate, UserLogin, UserRespond } from '../model/user.model';
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
    public delete(req:CustomRequest,res:Response){
        return res.send(req.user);
    }
    public update(req:Request,res:Response){
        return res.send('User update');
    }
    public login = async (req : Request, res : Response)   => {
        const login_re = req['body'] as UserLogin;
        try {
            const login_data = await this.user_service.login(login_re);
            return res.send(login_data);
        }
        catch(err) {
            if (err instanceof Error) {
                return res.status(400).send(err.message);
            }
            
        }
    }
    
    public routes() {
        this.router.get("/",this.index);
        this.router.post('/create',this.create);
        this.router.post('/login',this.login);
        this.router.put('/update',this.update);
        this.router.delete('/delete',this.delete);
    }
}