const quotePerPage = 6
let slicePlace = quotePerPage
let arryForHoldingQuotes = []
const quotesContainer = document.getElementById('quotes-container');
const loadMoreButton = document.getElementById('load-more');

const loopWithSlice = (start, end) => {
  const slicedQuotes = quotes.slice(start, end)
  arryForHoldingQuotes = arryForHoldingQuotes.concat(slicedQuotes)
  console.log(arryForHoldingQuotes)
}

const showMorePosts = () => {
  loopWithSlice(slicePlace, slicePlace + quotePerPage)
  slicePlace += quotePerPage
  if (slicePlace >= quotes.length) {
    loadMoreButton.style.display = 'none'; // Hide the button als alle quotes zijn ingeladen
  }
  // const newQuotes = arryForHoldingQuotes
  // newQuotes.forEach(quote => {
  //   const card = document.createElement('div');
  //   card.className = 'card';
  //   card.innerHTML = `
  //   <section class="card-info">
  //     <a class="card-name" href="${'<%= quote.charWiki %>'}" target="_blank"><%= quote.character %></a>
  //     <p class="card-total">Totaal quotes: <%= quote.totalCharQuotes %></p>
  //   </section>
  //   <section class="card-text">
  //       <p class="card-quote">"<%= quote.quote %>"</p>
  //   </section>
  //   <button type="submit" onclick="deleteFavQuote('<%= index %>')"><i class="fa-solid fa-trash"></i></button>
  //   `;
  //   quotesContainer.appendChild(card);
  // });
}

