import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async()=>{
    try{
        await mongoose.connect("mongodb+srv://atiqse999:0LusSV6IVq6J4QTh@cluster0.grvck.mongodb.net/tour-db?retryWrites=true&w=majority&appName=Cluster0")
        console.log("connect to the DB");

        server = app.listen(5000, ()=>{
            console.log("server is listening to port 5000");
        })
    }catch(error){
        console.log(error)
    }
}
startServer();

process.on("SIGTERM", ()=>{
    console.log('SIGTERM detected ... server shutting down ...');
    if(server){
        server.close(()=>{
            
        })
    }
    process.exit(1)
})

process.on("SIGINT", ()=>{
    console.log('SIGINT detected ... server shutting down ...');
    if(server){
        server.close(()=>{
            
        })
    }
    process.exit(1)
})

process.on("unhandledRejection", ()=>{
    console.log('Unhandled Rejection detected ... server shutting down ...');
    if(server){
        server.close(()=>{
            
        })
    }
    process.exit(1)
})

process.on("uncaughtException", ()=>{
    console.log('uncaught Exception  detected ... server shutting down ...');
    if(server){
        server.close(()=>{
            
        })
    }
    process.exit(1)
})

Promise.reject(new Error("i forgot to cach this promise"))

/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */

