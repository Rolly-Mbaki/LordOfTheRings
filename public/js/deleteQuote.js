const quotesData = document.getElementById("data").textContent;

const quotes = JSON.parse(quotesData);
let currentQuote = {quote:"", character:"", reason:""}
// console.log(favQuotes)
// document.addEventListener("DOMContentLoaded", function(event) {
//   console.log(quotes)
// });
async function deleteFavQuote(index) {
    let quote = quotes[index]

    try {
        const response = await fetch("/deleteFavQuote", {
          method: "post",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(quote)
        })
        console.log(response.body)
        if (response.ok) {
          console.log("Data deleted from mdb")
        } else {
          
          console.log("Failed to delete data from mdb")
        }
        window.location.reload()
      } catch (error) {
        console.log("Error: ", error)
      }
}

async function deleteBlQuote(index) {
  let quote = quotes[index]
  console.log(quote)
  try {
      const response = await fetch("/deleteBlQuote", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(quote)
      })
      console.log(response.body)
      if (response.ok) {
        console.log("Data deleted from mdb")
      } else {
        
        console.log("Failed to delete data from mdb")
      }
      window.location.reload()
    } catch (error) {
      console.log("Error: ", error)
    }
}

const input = document.getElementById("myReason")
function submitFormReturn(event){
  event.preventDefault()
  // console.log(input.value)
  updateBlQuote()
}

function getCurrentQuote(index) {
  let quote = quotes[index]
  currentQuote = quote
  console.log(quote)
}

async function updateBlQuote() {
  let quote = currentQuote

  let updatedQuote = {quote:quote.quote, character:quote.character, reason:input.value}

  console.log(quote)
  console.log(updatedQuote)
  try {
    const response = await fetch("/updateBlQuote", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(updatedQuote)
    })
    console.log(response.body)
    if (response.ok) {
      console.log("Data updated in mdb")
      window.location.reload()
    } else {
      console.log("Failed to update data in mdb")
    }
  } catch (error) {
    console.log("Error: ", error)
  }
}

function downloadQuotes() {
  const content = quotes.map(quote => `"${quote.quote}" - ${quote.character}`).join('\n\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FavQuotes.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function AllQuotes(index){
  let quote = quotes[index]
  let character = encodeURIComponent(quote.character)
  console.log(character)
  const url = `/fav/${character}`
  window.location = url;
  // const response = await fetch(`/fav/${character}`, {
  //   method: "get"
  // })
  // if (response.ok) {
  //   const quotes = await response.json();
  //   console.log(quotes);
  // } else {
  //   console.error('Failed to fetch quotes:', response.statusText);
  // }
}