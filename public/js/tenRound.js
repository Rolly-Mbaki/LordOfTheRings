        var jsonData = [];
        document.addEventListener('DOMContentLoaded', function() {
        var dataElement = document.getElementById('data');
        jsonData = JSON.parse(dataElement.textContent);

      });
      
      var icon2 = document.getElementById('dislikeBtn');
      var icon = document.getElementById('likeBtn');
      var audioIcon = document.getElementById('audioBtn');

      const openButton = document.querySelector("[data-open-modal]")
      const closeButton = document.querySelector("[data-close-modal]")
      const modal = document.querySelector("[data-modal]")
      
      const quizContainer = document.getElementsByClassName("quiz-container")
      const highScore = document.getElementById("highscore")
      const highestScore = document.getElementById("highestScore")
      const volumeIcon = document.getElementsByClassName("fa-volume-high")
      const modall = document.getElementsByClassName("modall")
      var audio = new Audio('../assets/Lord of the Rings_Sound of The Shire.mp3');
     
      window.onload = quizContainer[0].style.display="none"
      window.onload = volumeIcon[0].style.display="none"
      window.onload = highScore.style.display="none"

      const questionElement = document.getElementById("quote");
      const nextButton = document.getElementById("nextButton");
      const charAnswer = document.getElementById("options");
      const movieAnswer = document.getElementById("options1");
      const qouteNumber = document.getElementById("qouteNumber");

      const modal2 = document.querySelector("#modal2");
      const openModals = document.querySelectorAll('.open-button');
      const closeModal = document.querySelector('.close-button');

      let currentQuestionIndex = 0;
      let score = 0;
      let counter = 0;
      let charOptionClicked = false;
      let movieOptionClicked = false;

      
      const allMovieAnswers = document.getElementsByName("answerFilms");
      

      



      function like() {
        toevoegenFav()
        thumbsUp()
    }

    function thumbsUp() {
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon2.classList.remove('fas');
        icon2.classList.add('far');
      }
    }

    function thumbsDown() {
      if (icon2.classList.contains('far')) {
        icon2.classList.remove('far');
        icon2.classList.add('fas');
        icon.classList.remove('fas');
        icon.classList.add('far');
    } /* else {
        icon2.classList.remove('fas');
        icon2.classList.add('far');
    } */
    }

    async function toevoegenFav() {

      let favQuote = {quote:"", char:""}

      jsonData[counter].characterAnswers.forEach(element => {
        if (element.correct) {
          let quote = jsonData[counter].quote
          let char = jsonData[counter].characterAnswers[jsonData[counter].characterAnswers.indexOf(element)].name
          favQuote = {quote:quote, char: char}
        }
      });
      try {
        const response = await fetch("/like", {
          method: "post",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(favQuote)
        })
        const result = await response.json();
        if (response.ok) {
          retOp.innerHTML = `<b>${result.message}</b>`
          console.log("Data inserted into mdb")
        } else {
          retOp.innerHTML = `<b>${result.message}</b>`
          console.log("Failed to insert data in mdb")
        }
      } catch (error) {
        console.log("Error: ", error)
      }
    }

    async function toevoegenBl(input) {

      let blQuote = {quote:"", char:"", reason:""}

      jsonData[counter].characterAnswers.forEach(element => {
        if (element.correct) {
          let quote = jsonData[counter].quote
          let char = jsonData[counter].characterAnswers[jsonData[counter].characterAnswers.indexOf(element)].name
          let reason = input.value
          blQuote = {quote:quote, char: char, reason:reason}
        }
      });
      try {
        const response = await fetch("/dislike", {
          method: "post",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(blQuote)
        })
        const result = await response.json();
        if (response.ok) {
          retOp.innerHTML = `<b>${result.message}</b>`
          console.log("Data inserted into mdb")
          thumbsDown()
        } else {
          retOp.innerHTML = `<b>${result.message}</b>`
          console.log("Failed to insert data in mdb")
        }
      } catch (error) {
        console.log("Error: ", error)
      }
    }

  function dislike() {
    
    openModals.forEach((openModal) => {
      modal2.showModal();    
})

closeModal.addEventListener('click', () =>{
  modal2.close();
})
};

  const form=document.getElementById("dislike");
const retOp = document.getElementById("retOp");

function submitFormReturn(event){
  modal2.close()
  const input = document.getElementById("myReason")
  toevoegenBl(input)
}
  
      
        

      closeButton.addEventListener("click",startQuiz);

      function IsMovieOptionClicked() {
        movieOptionClicked = true;
        enableButton()
      }
      function IsCharOptionClicked() {
        charOptionClicked = true;
        enableButton()
      }

      function enableButton() {
        if (charOptionClicked && movieOptionClicked) {
          nextButton.style.visibility="visible"
        }
      }

      function startQuiz() {
        quizContainer[0].style.display="block"
        volumeIcon[0].style.display="block"
        modall[0].style.display="none"
        audio.play();
          
        audio.loop=true;

        currentQuestionIndex = 0;
        score = 0;
        
        showQuestion(jsonData[counter]);
      }
      function showQuestion(qoutes) {
        const input = document.getElementById("myReason")
        input.value=""
        retOp.innerHTML = ""
        nextButton.style.visibility="hidden"
        questionElement.innerHTML = '"' + qoutes.quote + '"';
        qouteNumber.innerHTML = counter+1 + "/10"
        const charHtmlString = qoutes.characterAnswers.map((qoute,index) => {
          return `<div class="form-check option">
          <input onclick="IsCharOptionClicked()" class="form-check-input" type="radio" name="answerChar" id="option${index}" value="${qoute.name}">
          <label class="form-check-label" for="option${index}">${qoute.name}</label>
        </div>`
        }).join('');
        charAnswer.innerHTML = charHtmlString;

        const movieHtmlString = qoutes.movieAnswers.map((qoute,index) => {
          return `<div class="form-check option">
          <input onclick="IsMovieOptionClicked()" class="form-check-input" type="radio" name="answerFilms" id="option${index+3}" value="${qoute.title}">
          <label class="form-check-label" for="option${index+3}">${qoute.title}</label>
        </div>`
        }).join('');
        movieAnswer.innerHTML = movieHtmlString;
        charOptionClicked = false
        movieOptionClicked = false
      }

      function toggleAudio() {
        if (audioBtn.classList.contains('fa-volume-high')) {
          audioBtn.classList.remove('fa-volume-high');
          audioBtn.classList.add('fa-volume-xmark');
    } else {
      audioBtn.classList.remove('fa-volume-xmark');
      audioBtn.classList.add('fa-volume-high');
    }
      }

      function togglePlay() {
        toggleAudio()
        audio.muted = !audio.muted;
      };

      async function postScore() {
        try {      
          const response = await fetch('/highscoreTenRound', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
               score: score
            })
         });
          console.log( await response.text())
          
        } catch (error) {
          console.log("Error: ", error)
        }
      }

      function increaseCount() {
        let correctCharAwnser = jsonData[counter].characterAnswers.filter((e) => e.correct == true)[0].name;
        let correctMovieAwnser = jsonData[counter].movieAnswers.filter((e) => e.correct == true)[0].title;
        
        for (let radio of document.getElementsByName("answerChar")) {
          if (radio.checked && correctCharAwnser === radio.value) {
            score = score + 0.5
          }
          
        }
        for (let radio of document.getElementsByName("answerFilms")) {
          if (radio.checked && correctMovieAwnser === radio.value) {
            score = score + 0.5
          }
          
        }

        if (counter >= jsonData.length -1) {
          counter = jsonData.length - 1;
          postScore()
          showHighScore()
      }
      else {
          counter++
      }
      
        showQuestion(jsonData[counter])
        if (icon.classList.contains('fas') || icon2.classList.contains('fas')) {
          icon.classList.remove('fas');
          icon.classList.add('far');
          icon2.classList.remove('fas');
          icon2.classList.add('far');
      }
     }

     function showHighScore() {
      highScore.style.display="flex"
      quizContainer[0].style.display="none"
      volumeIcon[0].style.display="none"
      audio.muted = !audio.muted;
      document.getElementsByClassName("container-fluid")[0].style.display="none"
      let highscorePoint = highestScore.innerHTML.split(":")
      if (parseInt(highscorePoint[1]) <= score) {
        highestScore.innerHTML = "Hoogste score: " + score 
      }
      document.getElementById("currentScore").innerHTML = "Huidige score: "+score
     }

      /* if(window.location.pathname == '/suddenDeath') {
      audio = new Audio('../assets/The Fellowship of the Ring Soundtrack-07-A Knife in the Dark.mp3');
    } else if (window.location.pathname == '/tenRound') {
      audio = new Audio('../assets/Lord of the Rings_Sound of The Shire.mp3');
    }  */
      
      