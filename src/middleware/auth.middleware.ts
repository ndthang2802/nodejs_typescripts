import express , {Request, Response} from 'express';
import { CustomRequest } from '../interfaces/customRequest.interface';
import { TokenService } from '../services/token.service';

export class AuthMiddleware {

    private token_service : TokenService;
    private unprotected_path : string[];

    constructor(){
        this.token_service = new TokenService();
        this.unprotected_path = ["/","/favicon.ico", "/api/user" ,"/api/user/login", "/api/user/create" ]
    }

    public invoke = async (req : CustomRequest, res: Response , next : express.NextFunction) : Promise<any> => {

        if (this.unprotected_path.includes(req.path) ) {
            return next()
        }

        const access_token  = req.header('access-token');
        const refresh_token = req.header('refresh-token');


        if ( !access_token ) {
            return res.status(403).send('Token is not provided')
        }

        try {
            const decoded = await this.token_service.verify_access(access_token);
            req.user = JSON.stringify(decoded);
            
        }
        catch (error) {
            console.log(error)
            res.sendStatus(401)
        }

        return next();

    }   

}

