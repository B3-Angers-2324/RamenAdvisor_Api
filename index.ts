// import express, { Express, Request, Response } from 'express';
// import baseRouter from './src/routes/BaseRouter';
// import { connectToDatabase } from './src/services/Database';
// import dotenv from 'dotenv';
// import HttpStatus from './src/constants/HttpStatus';
// var cors = require('cors');
// dotenv.config();

// const port = process.env.PORT;

// const app: Express = express();

// app.use(cors({
//     origin: '*'
// }));

// if(process.env.NODE_ENV === "dev") {
//     app.use((req, res, next) => {
//         var methode;
//         switch(req.method){
//             case "GET":
//                 methode = `\x1b[1m\x1b[42;1m ${req.method} \x1b[0m`;
//                 break;
//             case "POST":
//                 methode = `\x1b[1m\x1b[43;1m ${req.method} \x1b[0m`;
//                 break;
//             case "PUT":
//                 methode = `\x1b[1m\x1b[44;1m ${req.method} \x1b[0m`;
//                 break;
//             case "DELETE":
//                 methode = `\x1b[1m\x1b[41;1m ${req.method} \x1b[0m`;
//                 break;
//             case "PATCH":
//                 methode = `\x1b[1m\x1b[45;1m ${req.method} \x1b[0m`;
//                 break;
//             default:
//                 methode = `\x1b[0m ${req.method}`;
//                 break;
//         }
//         console.log(`[Server]: ${methode}  ${req.path}`);
//         next();
//     });
// }


// connectToDatabase()
//     .then(() => {

//         app.use(express.json()); // Middleware pour analyser le corps JSON
      
//         // app.use() //for middleware

//         app.use("/api/v1", baseRouter);

//         // add response for 404 routes
//         app.use((_: Request, res: Response) => {
//             res.status(HttpStatus.NOT_FOUND).json({"message": "Route not found"});
//         });

//         app.listen(port, () => {
//             console.log(`[server]:\x1b[33m Server is running on \x1b[34m${process.env.NODE_ENV}\x1b[33m mode at \x1b[34mhttp://localhost:${port}`);
//         });

//         })
//         .catch((err) => {
//         console.log("[server]: Server failed to start with error: ", err);
//         process.exit(1);
//         });


import app from './app';
import { connectToDatabase } from './src/services/Database';

const port = process.env.PORT;

try{
    app.listen(port, () => {
        console.log(`[server]:\x1b[33m Server is running on \x1b[34m${process.env.NODE_ENV}\x1b[33m mode at \x1b[34mhttp://localhost:${port}`);
    });

    connectToDatabase()
}catch(error){
    if (error instanceof Error) {
        console.log(`Error occured: (${error.message})`)
     }
}