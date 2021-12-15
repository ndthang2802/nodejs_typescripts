import "reflect-metadata";
import express , {Request, Response} from 'express';
import { createConnection } from 'typeorm';
import config from './config/ormconfig';
import { UserController } from './controllers/user.controller';
import { AuthMiddleware } from "./middleware/auth.middleware";

class Server {
    
    private app : express.Application;
    private user_controller : UserController;

    constructor() {
        
        this.app = express();
        this.configuration();
        this.routes();

    }

    public configuration(){
        this.app.set('port', process.env.PORT || 5000);
        var auth = new AuthMiddleware()
        this.app.use(auth.invoke)
        this.app.use(express.json())
    }

    public async routes(){

        await this.connectDB();
        
        this.app.get("/", (req: Request, res: Response) => {
            res.send('Hello words')
        });

        this.user_controller = new UserController();
        
        this.app.use('/api/user', this.user_controller.router);
    }

    public async connectDB(){
        try {
            const db_connection = await createConnection(config)
            await db_connection.runMigrations();
        }
        catch (error) {
            console.log('error when connecting to database',error)
            return 
        }
    }

    public  start(){

        this.app.listen(this.app.get('port'), ()=> {
            console.log(`App running on port ${this.app.get('port')}`)
        })
        
    }
}

const server = new Server();
server.start();