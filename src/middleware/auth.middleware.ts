import express , {Request, Response} from 'express';
import { CustomRequest } from '../interfaces/customRequest.interface';
import { TokenService } from '../services/token.service';

export class AuthMiddleware {

    private token_service : TokenService;
    private unprotected_path : string[];

    constructor(){
        this.token_service = new TokenService();
        this.unprotected_path = ["/", "/api/user" ,"/api/user/login", "/api/user/create" ]
    }

    public invoke = (req : CustomRequest, res: Response , next : express.NextFunction) : void => {

        if (this.unprotected_path.includes(req.path) ) {
            return next()
        }

        const access_token  = req.header('access-token');
        const refresh_token = req.header('refresh-token');


        if ( !access_token ) {
            res.status(403).send('Token is not provided')
        }

        try {
            const decoded = this.token_service.verify_access(access_token);
            req.user = JSON.stringify(decoded);
            
        }
        catch (error) {
            console.log(error)
            res.sendStatus(401)
        }

        return next();

    }   

}

