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