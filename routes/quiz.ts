const { getTenRandomQoutes } = require("../public/js/quizGame");

import { Quote } from "../types/quizTypes";

export default function quizRouter(quotes: Quote[]) {
const express = require("express");
const router = express.Router();
/*console.log(quotes[1])

 router.get("/suddenDeath",(req:any,res:any)=>{
    console.log(quotes[1])
    res.render("suddenDeath",{qoute:quotes[1]});
})

router.get("/tenRound", async (req:any,res:any)=>{
    res.render("tenRound");
})

router.get("/tenRoundd", async (req:any,res:any)=>{
    res.json(quotes);
}) */

router.get("/testTyler",(req:any,res:any)=>{
    res.json(quotes);
})
return router;
}