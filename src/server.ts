import { envVars } from './app/config/.env';
import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;

const startServer = async()=>{
    try{

        await mongoose.connect(envVars.DB_URL);

        server = app.listen(envVars.PORT, ()=>{
            console.log(`server is listening to port ${envVars.PORT}`);
        })
    }catch(error){
        console.log(error)
    }
}
(async()=>{
    await startServer()
    await seedSuperAdmin()
})()

// process.on("SIGTERM", ()=>{
//     console.log('SIGTERM detected ... server shutting down ...');
//     if(server){       
//         server.close(()=>{
            
//         })
//     }
//     process.exit(1)
// })

// process.on("SIGINT", ()=>{
//     console.log('SIGINT detected ... server shutting down ...');
//     if(server){
//         server.close(()=>{
            
//         })
//     }
//     process.exit(1)
// })

// process.on("unhandledRejection", ()=>{
//     console.log('Unhandled Rejection detected ... server shutting down ...');
//     if(server){
//         server.close(()=>{
            
//         })
//     }
//     process.exit(1)
// })

// process.on("uncaughtException", ()=>{
//     console.log('uncaught Exception  detected ... server shutting down ...');
//     if(server){
//         server.close(()=>{
            
//         })
//     }
//     process.exit(1)
// })

// Promise.reject(new Error("i forgot to cach this promise"))

/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */

