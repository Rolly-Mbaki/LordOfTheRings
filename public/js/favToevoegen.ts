import dotenv from "dotenv";
import { getChars } from '../js/quizGame'
const {MongoClient} = require('mongodb');
const uri:string = process.env.MONGO_URI as string;
const client = new MongoClient(uri, { useUnifiedTopology: true });

dotenv.config();

export let getWiki = async (name:string) => {
    let chars = await getChars(1000)

    let wiki = chars.find(char => char.name == name)

    return wiki?.wikiUrl
}


export let fav = async (username:string,quote:any) => {await client.connect();
    try {
        let userObject = await client.db('LOTR').collection('Users').findOne({username:username})
    
        if (userObject) {
            await client.db('LOTR').collection('Users').updateOne({ name: username }, { $set: { favQuote: quote }})
        }
        
    } catch (error) {
        console.log('error: ', error)
    }
}