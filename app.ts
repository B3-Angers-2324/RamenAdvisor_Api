import express, { Express, Request, Response } from 'express'
import baseRouter from './src/routes/BaseRouter';
import HttpStatus from './src/constants/HttpStatus';
import { connectToDatabase } from './src/services/Database';
import * as dotenv from 'dotenv'

var cors = require('cors');
dotenv.config()
const app: Express = express()

app.use(cors({
    origin: '*'
}));

if(process.env.NODE_ENV === "dev") {
    app.use((req, res, next) => {
        var methode;
        switch(req.method){
            case "GET":
                methode = `\x1b[1m\x1b[42;1m ${req.method} \x1b[0m`;
                break;
            case "POST":
                methode = `\x1b[1m\x1b[43;1m ${req.method} \x1b[0m`;
                break;
            case "PUT":
                methode = `\x1b[1m\x1b[44;1m ${req.method} \x1b[0m`;
                break;
            case "DELETE":
                methode = `\x1b[1m\x1b[41;1m ${req.method} \x1b[0m`;
                break;
            case "PATCH":
                methode = `\x1b[1m\x1b[45;1m ${req.method} \x1b[0m`;
                break;
            default:
                methode = `\x1b[0m ${req.method}`;
                break;
        }
        next();
    });
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.json()); // Middleware pour analyser le corps JSON

app.use("/api/v1", baseRouter);

// add response for 404 routes
app.use((_: Request, res: Response) => {
    res.status(HttpStatus.NOT_FOUND).json({"message": "Route not found"});
});

// connectToDatabase()

export default app