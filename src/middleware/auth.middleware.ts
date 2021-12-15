import  Jwt  from 'jsonwebtoken';
import express , {Request, Response} from 'express';
import { Token } from '../model/token.model';

export class AuthMiddleware {
    private key : string;
    constructor(){
        this.key = process.env.JWT_KEY || "thisisverysecret";
    }

    private verify_token(token : any) {
        try {
            const decoded = Jwt.verify(token, this.key);
            return decoded
          } catch (err) {
            console.log(err);
            throw new Error('Invalid token')
          }
    }

    public invoke (req : Request, res: Response , next : express.NextFunction) : void {
        const access_token  = req.header('access-token');
        const refresh_token = req.header('refresh-token');

        if ( !access_token ) {
            res.sendStatus(403)
        }

        try {
            const decoded = this.verify_token(access_token);
            req['body'].user = decoded
        }
        catch (error) {
            console.log(error)
            res.sendStatus(401).send('Invalid token')
        }

        return next();

    }   

}

