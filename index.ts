import express from "express";
import ejs from "ejs";
import dotenv from "dotenv"
import session from "./session";
const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt')

dotenv.config()

import { getMovies, getQoute, getApiLength, getChars,getRandomQoutes,linkCharsAndMovieToQoute } from "./public/js/quizGame";
import { addQuotesToDB } from "./public/js/QuotesDb";
import { Quote, gameQuote, FavQuote, BlQuote } from "./types/quizTypes";
import quizRouter from "./routes/quiz";
import { log } from "console";

const app = express();

const uri:string = process.env.MONGO_URI as string;
const client = new MongoClient(uri);

export interface User {
    _id?:string,
    email:string,
    username:string,
    password:string,
    favQuotes:FavQuote[],
    blQuotes:BlQuote[],
    tenRoundHighScore:number,
    suddenDeathHighScore:number,
  }
  
let message:string = "";
let error:boolean = true;
let user:User = {
    username: "",
    email:"",
    password:"",
    favQuotes:[],
    blQuotes: [],
    tenRoundHighScore:0,
    suddenDeathHighScore:0
};

//middleware
app.use(session)
app.use(express.json())
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}))

const isAuth = (req:any, res:any, next:any) =>{
    if(req.session.isAuth){
        next()
    } else {
        res.redirect("/login")
    }
}

app.set("view engine", "ejs");
app.set("port", 3000);

let quotes: Quote[] = [{id:"d",_id:"",dialog:"d",character:"d",movie:"d",wikiUrl:"d"}];
let blacklistedQoutes: Quote[] = []
linkCharsAndMovieToQoute().then(data => (quotes = data))

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/home", isAuth, (req,res)=>{
    res.render("home",{user:req.session.user});
})

app.get("/login",(req,res)=>{
    if (req.session.isAuth) {
        res.redirect("/home")
    }
    else res.render("login")
})

app.post("/login", async (req,res)=>{
    try {
        await client.connect();

        let userObject:User = await client.db('LOTR').collection('Users').findOne({username:req.body.username.toString().toLowerCase()})

        if (userObject == null) {
            message = "Gebruiker niet gevonden"
            error = true
            res.render("login",{message:message,error:error})
        }
        if (userObject!=null) {
            const isPasswordMatch = await bcrypt.compare(req.body.password, userObject.password)
            if (isPasswordMatch){
                //hier moet ik session beginnen maken
                //req.session.isLoggedIn = true
                req.session.isAuth = true
                // console.log(req.session.id)
                req.session.user = userObject
                // console.log(req.session.user)
                // user = userObject;
                res.redirect("home")
            }
            else{
                message= "Fout wachtwoord"
                error= true
                res.render("login",{message:message,error:error})
            }
        }

    } catch (e) {
        console.error(e);
    }
})

app.get("/register", async (req,res)=>{
    try {
        await client.connect();
        if (req.session.isAuth) {
            res.redirect("/home")
        }
        else res.render("register")
    } catch (error) {
        console.error(error)
    }
    
})

app.post("/register", async (req,res)=>{

    let newUser:User = {
        username:req.body.username.toString().toLowerCase(),
        email:req.body.email.toString().toLowerCase(),
        password:req.body.password,
        favQuotes:[],
        blQuotes: [],
        tenRoundHighScore:0,
        suddenDeathHighScore:0
      }
      const saltRounds = 10
      const hashehPassword = await bcrypt.hash(newUser.password, saltRounds)

      newUser.password = hashehPassword

        let userEmail = await client.db('LOTR').collection('Users').findOne({email:req.body.email.toString().toLowerCase()})

        let userUsername = await client.db('LOTR').collection('Users').findOne({username:req.body.username.toString().toLowerCase()})
        
        if (userEmail == null) {

            if (userUsername != null) {
            
                message = "Gebruikersnaam bestaat al"
                error = true
                userUsername = null
                res.render("register",{message:message,error:error})
            }  
            else if (req.body.password.length > 6) {
                await client.db('LOTR').collection('Users').insertOne(newUser);
                req.session.isAuth = true
                req.session.user = newUser
                message = "Account succevol aangemaakt!"
                error = false

                res.redirect("home")
            } 
            else if (req.body.password.length <= 7) {
                message = "Wachtwoord bevat minder dan 8 karakaters"
                error = true
                res.render("register",{message:message,error:error})
          }
        } 

        if (userEmail != null) {
          
            message = "Email bestaat al"
            error = true
            userEmail = null
            res.render("register",{message:message,error:error})
        }
        

});

app.get("/blacklist",isAuth, async (req,res)=>{


        let userObject:User = await client.db('LOTR').collection('Users').findOne({username:req.session.user?.username})
        if (userObject) {
            let blQuotes:BlQuote[] = userObject.blQuotes
            res.render("blacklist",{user:req.session.user, blQuotes})
        }

})

app.get("/fav",isAuth, async (req,res)=>{

    let userObject:User = await client.db('LOTR').collection('Users').findOne({username:req.session.user?.username})
    if (userObject) {
        let favQuotes:FavQuote[] = userObject.favQuotes
        const paginatedQuotes = favQuotes.slice(0,6)
        res.render("fav",{user:req.session.user, favQuotes,paginatedQuotes})
    }

})

app.get("/fav/:character",isAuth, async (req,res)=>{

    const character = decodeURIComponent(req.params.character)
    const allQuotes:Quote[] = quotes.filter(quote => quote.character.toLowerCase() == character.toLowerCase()) 
    
    res.render("quotesPerChar",{user:req.session.user, allQuotes})
})

app.get("/tenRound",isAuth, async(req,res)=>{
        let currentUser:User = await client.db('LOTR').collection('Users').findOne({username: req.session.user?.username})

        /* if (blacklistedQoutes.filter(value => value.dialog == currentUser.blQuotes[0].quote).length > 0) {
            console.log("it's in");
        } */

        if (currentUser.blQuotes.length) {
        blacklistedQoutes = [...quotes.filter((qoute)=> currentUser.blQuotes.every((blQuote)=> blQuote.quote !== qoute.dialog))]
        }
        

        /* if (blacklistedQoutes.filter(value => value.dialog == currentUser.blQuotes[0].quote).length > 0)
            console.log("it's in game");
        else {
            console.log("qoute not in")
        }   */

    /* blacklistedQoutes = blacklistedQoutes.sort(() => 0.5 - Math.random()).slice(0,10) */ //ZET BIJ DISLIKE currentuser etc. in commentaat
    let randomQuotes:gameQuote[] = getRandomQoutes(blacklistedQoutes,quotes,10)
    res.render("tenRound",{qoutes:randomQuotes,user:req.session.user, added:false,highscore:currentUser.tenRoundHighScore});
})

app.get("/suddenDeath",isAuth, async(req,res)=>{
    
    let currentUser:User = await client.db('LOTR').collection('Users').findOne({username: req.session.user?.username});

    if (currentUser.blQuotes.length) {
    blacklistedQoutes = [...quotes.filter((qoute)=> currentUser.blQuotes.every((blQuote)=> blQuote.quote !== qoute.dialog))]
    }

    let randomQuotes:gameQuote[] = getRandomQoutes(blacklistedQoutes,quotes,blacklistedQoutes.length)
    res.render("suddenDeath",{user:req.session.user,qoutes:randomQuotes,added:false,highscore:currentUser.suddenDeathHighScore});
})


app.post("/logout", async(req,res) =>{
    req.session.destroy(e => {
        if(e) throw e
        res.redirect('/login')
    })
    await client.close();
})

app.post("/like", async (req,res) =>{
    let charWiki = quotes.find(char => char.character == req.body.char)?.wikiUrl
    let totalQuotes = quotes.filter(quote => quote.character === req.body.char).length

    let favQuote:FavQuote = {quote:"", character:"", charWiki:"",totalCharQuotes:0}
    if (req.body.char) {
        if (charWiki) {
            favQuote = {quote: req.body.quote, character:req.body.char, charWiki:charWiki, totalCharQuotes:totalQuotes} 
        } else {
            favQuote = {quote: req.body.quote, character:req.body.char, charWiki:"", totalCharQuotes:totalQuotes}
        }
    }
    


        const filter = {username: req.session.user?.username}

        const taken = await client.db('LOTR').collection('Users').findOne({
            username: req.session.user?.username,
            blQuotes: { $elemMatch: { quote: favQuote.quote } }
        });

        let update

        if (taken) {
            update = {
                $pull: { blQuotes: { quote: favQuote.quote } },
                $addToSet: { favQuotes: favQuote }
            };
        } else {
            update = { $addToSet: { favQuotes: favQuote } };
        }

        const add = await client.db('LOTR').collection('Users').updateOne(filter, update)

        if (add.modifiedCount === 0) {
            // console.log("Quote already exists in the array");
            return res.status(409).send({message:"Quote zit al tussen je favorieten"});
        }
        // console.log("Quote added to favQuotes array");

        res.status(200).send({ message: "Quote toegevoegd aan je favorieten"});


})

app.post("/dislike", async (req,res) =>{
        let blQuote:BlQuote = {quote:req.body.quote, character:req.body.char, reason:req.body.reason}
   
        let currentUser:User = await client.db('LOTR').collection('Users').findOne({username: req.session.user?.username})
    if (currentUser.blQuotes.length) {
        blacklistedQoutes = [...quotes.filter((qoute)=> currentUser.blQuotes.every((blQuote)=> blQuote.quote !== qoute.dialog))]
          
        } 
 
        const filter = {username: req.session.user?.username}
        // const add = {$addToSet: {blQuotes: blQuote}}
        // const remove = {$pull: {favQuotes: {quote: blQuote.quote}}}
 
        const taken = await client.db('LOTR').collection('Users').findOne({
            username: req.session.user?.username,
            favQuotes: { $elemMatch: { quote: blQuote.quote } }
        });
 
        const alreadyIn = await client.db('LOTR').collection('Users').findOne({
            username: req.session.user?.username,
            blQuotes: { $elemMatch: { quote: blQuote.quote } }
        });
 
        let update
        if (blacklistedQoutes.length >= 11) {
        if (taken) {
            update = {
                $pull: { favQuotes: { quote: blQuote.quote } },
                $addToSet: { blQuotes: blQuote }
            };
            // console.log("Quote moved from favQuotes to blQuotes");
        }
        else {
            update = { $addToSet: {blQuotes: blQuote} }
        }
 
        if (alreadyIn) {
            return res.status(409).send({message:"Quote zit al tussen jouw geblacklisten"});
        } else {
            await client.db('LOTR').collection('Users').updateOne(filter, update);
            res.status(200).send({ message: "Quote toegevoegd aan je geblacklisten"});
            // console.log("Quote added to blacklist array");
        }
    } else if (blacklistedQoutes.length <= 10) {
        return res.status(409).send({message:"Je hebt meer dan 10 quotes nodig"});
    }

})

app.post("/deleteFavQuote", async (req,res) =>{
        const filter = {username: req.session.user?.username}
        const update = {$pull: {favQuotes: {quote: req.body.quote}}}
        const remove = await client.db('LOTR').collection('Users').updateOne(filter, update)

        if (remove.modifiedCount === 0) {
            // console.log("Quote not found in the array")
            return res.status(404).send("Quote not found in the array")
        }
        // console.log("Quote removed from favQuotes array");

        res.status(200).send("Data deleted from MDB");


})

app.post("/deleteBlQuote", async (req,res) =>{

        const filter = {username: req.session.user?.username}
        const update = {$pull: {blQuotes: {quote: req.body.quote}}}
        const remove = await client.db('LOTR').collection('Users').updateOne(filter, update)

        if (remove.modifiedCount === 0) {
            // console.log("Quote not found in the array")
            return res.status(404).send("Quote not found in the array")
        }
        // console.log("Quote removed from favQuotes array");

        res.status(200).send("Data deleted from MDB");

})

app.post("/updateBlQuote", async (req,res) =>{
        const filter = { 
            username: req.session.user?.username,
            "blQuotes.quote": req.body.quote 
        };

        const update = { 
            $set: { "blQuotes.$.reason": req.body.reason } 
        };

        const result = await client.db('LOTR').collection('Users').updateOne(filter, update);

        if (result.modifiedCount === 0) {
            // console.log("Quote not found in the array")
            return res.status(404).send("Quote not found in the array")
        }
        // console.log("Reason changed");

        res.status(200).send("Reason updated");


})

app.post("/highscoreTenRound", async(req,res)=> {
    await client.db('LOTR').collection('Users').updateOne({username: req.session.user?.username},{$max:{tenRoundHighScore:req.body.score}}, { upsert: true });
    res.status(200).send({ message: "Highscore success"});
})

app.post("/highscoreSuddenDeath", async(req,res)=> {
    await client.db('LOTR').collection('Users').updateOne({username: req.session.user?.username},{$max:{suddenDeathHighScore:req.body.score}}, { upsert: true });
    res.status(200).send({ message: "Highscore success"});
})

app.use((req,res)=> {
    res.status(404);
    res.render("404",{user:req.session.user});
})

app.listen(app.get("port"), async () => {
    
    quotes = await linkCharsAndMovieToQoute()
    blacklistedQoutes = [...quotes]
    console.log("[server] http://localhost:" + app.get("port"))
});