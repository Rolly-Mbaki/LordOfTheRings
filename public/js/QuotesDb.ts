import dotenv from "dotenv";
import { Quote } from "../../types/quizTypes";
const {MongoClient} = require('mongodb');
dotenv.config();
const uri:string = process.env.MONGO_URI as string;
const client = new MongoClient(uri, { useUnifiedTopology: true });

export const addQuotesToDB = async (quotes:Quote[]) => {
    //when the app starts i want to check of er nieuwe quotes
    //Zo niet dan steek je de nieuwe erbij in

    try {
        await client.connect();
        for (let i = 0; i < quotes.length; i++) {
            let quoteObject:Quote =  await client.db('LOTR').collection('Quotes').findOne({id:quotes[i].id})
            
            if (quoteObject == null) {
                await client.db('LOTR').collection('Quotes').insertOne(quotes[i])
            }
        }
    } catch (error) {
        console.log('Error: ', error)
    } finally {
        await client.close();
    } 
}