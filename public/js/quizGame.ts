import { Quote,Character,Movie,gameQuote } from "../../types/quizTypes";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.LOTR_API_KEY as string;

export const getApiLength = async () => {
  const response2 = await fetch('https://the-one-api.dev/v2/quote', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  const lengthApiJson = await response2.json();
  const lengthOfApi = lengthApiJson.total
  return lengthOfApi;
}



export const getQoute = async (limit:number=10000) => {
    const apiUrl = `https://the-one-api.dev/v2/quote?limit=${limit}`;

    const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
    const responeDoc = await response.json();
    const quotes:Quote[] = responeDoc.docs
    return quotes;
}

export const getChars = async (limit:number=10000) => {
  const apiUrl = `https://the-one-api.dev/v2/character?limit=${limit}`;

  const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
  const responeDoc = await response.json();
  const chars:Character[] = responeDoc.docs
  return chars;
}

export const getMovies = async (limit:number=10000) => {

  const apiUrl = `https://the-one-api.dev/v2/movie?limit=${limit}`;

  const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
  const responeDoc = await response.json();
  const movies = responeDoc.docs
  return movies;
}

export const linkCharsAndMovieToQoute = async() => {
  let limit = await getApiLength();
  let qoutes:Quote[] = await getQoute(limit);
  let chars:Character[] = await getChars(limit);
  let movies:Movie[] = await getMovies(limit);
  if (qoutes) {
    for (let i = 0; i < qoutes.length; i++) {
      const char:Character = chars.find(char => char._id === qoutes[i].character)!;
      const movie:Movie = movies.find(movie => movie._id === qoutes[i].movie)!;
      qoutes[i].character = char.name
      qoutes[i].wikiUrl = char.wikiUrl
      if (qoutes[i].character == "MINOR_CHARACTER") {
        qoutes[i].character = "Minor Character"
      }
      qoutes[i].movie = movie.name
    }
  }
  return qoutes
}
export interface gameAwnsers {
  name:string,correct:boolean,
}
const shuffleChars = (arr:gameQuote["characterAnswers"]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const shuffleMovies = (arr:gameQuote["movieAnswers"]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const shuffleArray = (arr:any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const getRandomQoutes = (blacklistedQoutes:Quote[],allQuotes:Quote[],n:number) => {

  const shuffledBlacklist:Quote[] = shuffleArray(blacklistedQoutes);
  allQuotes = shuffleArray(allQuotes);

  let gameQuotes:gameQuote[] = [{
    quote: "",
    characterAnswers:[
      {name:"",correct:false},
  ],
    movieAnswers:[
    {title:"",correct:false},
]
  }]

  for (let i = 0; i < n; i++) {

  /* let randomQuoteNumber = Math.floor(Math.random() * shuffledBlacklist.length); */

  let correctChar = shuffledBlacklist[i].character;
  let correctQuote = shuffledBlacklist[i].dialog;
  let correctMovie = shuffledBlacklist[i].movie;


  let tempData:gameQuote = {
    quote: correctQuote,
    characterAnswers:[
      {name:correctChar,correct:true},
    ],
    movieAnswers:[
      {title:correctMovie,correct:true},
    ]
  }

//fill chars---
for (let j = 0; j < 2; j++) {
  
  let itemFound = true;
  
  while(itemFound) {
    let randomCharFromAllQoutes = allQuotes[Math.floor(Math.random() * allQuotes.length)].character;
    let charInArray = tempData.characterAnswers.every((char) => {
      return char.name !== randomCharFromAllQoutes;
  });
    if(charInArray) {
      tempData.characterAnswers.push({name:randomCharFromAllQoutes,correct:false});
      itemFound = false;
    }
  }
}

//fill movies ----

for (let j = 0; j < 2; j++) {

  let itemFound = true
  
  while(itemFound) {
    let randomMovieFromAllQoutes = allQuotes[Math.floor(Math.random() * allQuotes.length)].movie
    let movieInArray = tempData.movieAnswers.every((movie) => {
      return movie.title !== randomMovieFromAllQoutes;
    });
    if(movieInArray) {
      tempData.movieAnswers.push({title:randomMovieFromAllQoutes,correct:false});
      itemFound = false;
    }
  }
}
//---

  tempData.characterAnswers = shuffleChars(tempData.characterAnswers);
  tempData.movieAnswers = shuffleMovies(tempData.movieAnswers);

  gameQuotes.push(tempData);

}
  gameQuotes.shift();

  return gameQuotes;
}

