export interface Quote {
    _id:string;
    dialog:string;
    movie:string;
    character:string;
    wikiUrl:string;
    id:string
}

export interface Character {
    _id:     string;
    name:    string;
    wikiUrl: string;
}

export interface Movie {
    _id:                        string;
    name:                       string;
}

export interface gameQuote {
    quote:string;
    characterAnswers:[
        {name:string,correct:boolean},
    ]
    movieAnswers:[
        {title:string,correct:boolean},
    ]
}

export interface FavQuote {
    quote:string,
    character:string,
    charWiki:string,
    totalCharQuotes:number
}

export interface BlQuote {
    quote:string,
    character:string,
    reason:string
}