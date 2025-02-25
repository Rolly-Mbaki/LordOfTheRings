import dotenv from "dotenv";
import {User} from './api/index'
dotenv.config();

import session from "express-session";
import mongoDbSession from "connect-mongodb-session";
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: process.env.MONGO_URI as string,
    collection: "Sessions",
    databaseName: "LOTR",
});

// mongoStore.on("error", (error) => {
//     console.error(error);
// });

declare module 'express-session' {
    export interface SessionData {
        user?:User,
        isAuth:boolean
    }
}

export default session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}
});