//---------------------------------> VARIABLES <--------------------------------------
//---------------------------------------------------------------------------------------

//-------------> Constantes:
const apiKey = "d904d77c7a9f5010c5b00756443838e0";
const imageStart = "https://image.tmdb.org/t/p/w300/";

//Info about movie
const querryFilmName = "https://api.themoviedb.org/3/search/movie?api_key="+apiKey+"&query=";

const querryFilmStart="https://api.themoviedb.org/3/movie/"; //+ Id movie ex : 671
const querryFilmEnd = "?api_key="+apiKey;

//Info about casting/crew of a movie
const querryCastStart = "https://api.themoviedb.org/3/movie/"; //+ Id movie ex : 671
const querryCastEnd = "/credits?api_key="+apiKey;

//Info about people
const querryPeopleStart ="https://api.themoviedb.org/3/person/"; //+Id person ex : 10980
const querryPeopleEnd = "?api_key="+apiKey;

//Info about all movie with a specify actor
const querryActorsMoviesStart = "https://api.themoviedb.org/3/person/"; //+Id actor ex : 10980
const querryActorsEnd = "/movie_credits?api_key="+apiKey;

//-------------> Variables : 
//Here we define with witch movie we want to start (see index.html too)
var idMovie = 671;
var movieName = "";

//Users must never enter the same movie name twice. if they do , don't accept the answer and display an adapted error message.
var moviesSubmited = [];
moviesSubmited.push("Harry Potter and the Philosopher's Stone".toLowerCase());

//Depend on the answer about the actor 
var ActorsDirectorName = "";
var idPerson = "";

// Starting variables :
var question = "guessActorsDirector"; 
var turn = 0;

var moviesResponse = "";
var castResponse = "";

var resultCheck = "";


//To wait the html to be load
window.onload = function() {

  //----------------------> ENTER/Click BUTON to submit ANSWER <------------------------
  //Function to accpet enter instead of clicking the submit button
  // Get the input field
  var input = document.getElementById("submit");

  // Execute a function when the user releases a key on the keyboard
  input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();

      //If the answer is correct, click on next
      if (document.getElementById("next").disabled == false)
      {
        Next();
        //document.getElementById("next").click();
      }
      else{
        // Trigger the button element with a click
        document.getElementById("check").click();
        //call the check function
        //CheckAnswer();
      }
    }
  });

  window.onload = function() {

    var input = document.getElementById("username");
    input.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        login();
      }
    });
  }

  //call the first answer preparation
  firstAnswer();
}


//---------------------------------------------------------------------------------------
//---------------------------------> CHECK ANSWER <--------------------------------------
//---------------------------------------------------------------------------------------

function CheckAnswer(){

  let userAnswer = document.getElementById("submit").value;
  let result = "";

  //The search will be case insensitive
  userAnswer = userAnswer.toLowerCase(); //.replace("'", " ");

  //------------> CAS 1 : Actors question type 
  if (question == "guessActorsDirector") //or director
  {
    //console.log("guessActorsDirector"); 
    var find = false;

    //CheckActors
    castResponseActors = castResponse.cast;
    const numberActors = Object.keys(castResponseActors).length;

    for (let i = 0; i < numberActors; i++) 
    {      
      answer = castResponseActors[i].name.toLowerCase(); //.replace("'", " ");
      resultCheck = check(answer, userAnswer);
      
      if (resultCheck == "Well done, it is correct !".fontcolor("green"))
      {
        find = true;
        ActorsDirectorName = castResponseActors[i].name;
        idPerson = castResponseActors[i].id;
        break;
      }
      else if(resultCheck == "Correct but you already submit that movie/person !".fontcolor("orange"))
      {
        find = true;
        break;
      }
  
    }
    if(find==false) //Check director
    {
      castResponseDirector = castResponse.crew;
      const numberCrew = Object.keys(castResponseDirector).length;
      
      for (let i = 0; i < numberCrew; i++) 
      {      
        if (castResponseDirector[i].job == "Director")
        {
          //console.log("JOB",castResponseDirector[i].name);
          answer = castResponseDirector[i].name.toLowerCase(); 
          resultCheck = check(answer, userAnswer);
          
          if (resultCheck == "Well done, it is correct !".fontcolor("green"))
          {
            find = true;
            ActorsDirectorName = castResponseDirector[i].name;
            idPerson = castResponseDirector[i].id;
            break;
          }
          //only one director y films
          break;
        }
        
        
      }

    }
  }
  
  else if(question == "guessMovie") //------------> CAS 2 : Movie question type 
  {
    //console.log("guessMovie");

    var find = false;

    //Check films the person plays in
    moviesResponseCast = moviesResponse.cast;
    const numberFilms = Object.keys(moviesResponseCast).length;
    
    for (let i = 0; i < numberFilms; i++) 
    {      
      answer = moviesResponseCast[i].title.toLowerCase(); 
      resultCheck = check(answer, userAnswer);
      
      if (resultCheck == "Well done, it is correct !".fontcolor("green"))
      {
        movieName =  moviesResponseCast[i].title;
        idMovie = moviesResponseCast[i].id;
        find = true;
        break;
      }
      else if(resultCheck == "Correct but you already submit that movie/person !".fontcolor("orange"))
      {
        find = true;
        break;
      }
      
    }
    if(find==false) //Check director of the movie submited
    {
      
      moviesResponseCrew = moviesResponse.crew;
      const numberCrew = Object.keys(moviesResponseCrew).length;
      
      for (let i = 0; i < numberCrew; i++) 
      {      
        if (moviesResponseCrew[i].job == "Director")
        {
          //console.log("JOB MOVIE",moviesResponseCrew[i].title);
          answer = moviesResponseCrew[i].title.toLowerCase(); 
          resultCheck = check(answer, userAnswer);
          
          if (resultCheck == "Well done, it is correct !".fontcolor("green"))
          {
            movieName =  moviesResponseCrew[i].title;
            idMovie = moviesResponseCrew[i].id;
            find = true;
            break;
          }
          else if(resultCheck == "Correct but you already submit that movie/person !".fontcolor("orange"))
          {
            find = true;
            break;
          }
          
        }
        
        
      }

    }
    
    
  }

  document.getElementById("result"+turn).innerHTML = resultCheck;
  
}

//---------------------------> Check sub function
function check(answer, userAnswer)
{
  let result = "";
  //The user must enter full name
  if (answer == userAnswer)
  {

    if (moviesSubmited.includes(answer))
    {
      result = "Correct but you already submit that movie/person !".fontcolor("orange");
      
    }
    else
    {
      moviesSubmited.push(answer);
      result = "Well done, it is correct !".fontcolor("green");

      //Authorize to pass to the next question
      document.getElementById("next").disabled = false;
      //or could be repleace direclty by :
      //Next();
    }
  }//Could me improuve, juste an idea. Only working for director close guess for now
  else if (answer.includes(userAnswer)) 
  {
    result = "Close, continue guessing".fontcolor("red");
  } 
  else 
  {
    //If the answer is wrong display a message in red near the submit button
    result = "Wrong answer ! Please try again".fontcolor("red");

  }
  return result;
}

//----------------------> Prepare athe answer for the first question <------------------------
async function firstAnswer(){
  url = querryCastStart  + idMovie + querryCastEnd;
  castResponse = await fetch(url).then(OnSuccess, onError).then(ReadOnSuccess);
  //console.log("URL movie cast : ", url);
  Focus();
  }
  
//Put the focus
function Focus()
{
  //Scroll to the end of the page: seems to not work on chrome
  window.scrollTo(0,document.body.scrollHeight);

  //Put focus: the user can directly write. When the user write, the page scroll a little bit
  //Need to be improve but didn't find the right function for now.
  //document.getElementById("submit").focus();
  //{preventScroll:false} seems to not work on chrome also//
  document.getElementById("submit").focus({preventScroll:false});
}


//---------------------------------------------------------------------------------------
//-------------------------------> CALL NEXT QUESTION <----------------------------------
//---------------------------------------------------------------------------------------

//If the answer is good, add a new div below the form div with the actor or director info : name, photo
function Next(){

  //Clean Previous question
  document.getElementById("result"+turn).innerHTML = "";
  document.getElementById("form"+turn).innerHTML = "";


  //Upgrade the variable state
  turn = turn + 1;

  if(question == "guessActorsDirector"){
    question = "guessMovie";
  } 
  else{
    question = "guessActorsDirector"; //or guessDirector;
  }

  //Add next question
  document.body.onload = addElement();
  //Update check submit buton for click with enter
  input = document.getElementById("submit");

  //Disable the button while the new question have no correct answer
  document.getElementById("next").disabled = true;

  //Go to the end of the page/where is the next question
  //Focus the input texte
  Focus();
}


//-----------------------------> ADD ELEMENT html <------------------------------

//Add new div with movieInfo or Actors/Directors Info + forms
function addElement() {

  let quizz = document.getElementById('quizz');

  // The html div template
  let htmlQuestionTemplate = "<p>---------------------------------------------------------------------</p>"+ 
  "<div id=question"+turn+">" + 
  //If the answer is good, add a new div below the form div with the actor or director info : name, photo
  "<div id=info"+turn+">" + 
  "</div>"+
  //Below this div display a div containing a form
  "<div id=form"+turn+">"+
  //change the question/buton input
  "<input id=submit type=text value='' placeholder = '....' autofocus > "+
  "<button onClick = CheckAnswer() id=check >Check</button>"+
  "</div>"+
  "<div id=answer"+turn+">"+
  "<p id=result"+turn+"></p>"+
  "</div>"+"</div>";

  quizz.insertAdjacentHTML('beforeend', htmlQuestionTemplate);

  //Fill the template with the next question
  choseNextQuestion();

}


//-----------------------------> NEXT QUESTION FILL <---------------------------------

async function choseNextQuestion(){

  //-----------------------------> CAS 1 : After actors question type -> Movies question type
  if(question == "guessActorsDirector"){ //or guessDirector it is the same ;
    
    //console.log("Movie image FiLL");

    //------------> Fill new question 
    //Fill html with title, release date and poster 
    let url = querryFilmStart + idMovie+ querryFilmEnd;
    let movieResponse = await fetch(url).then(OnSuccess, onError).then(ReadOnSuccess);
    //console.log("URL movie films : ", url);

    //add info
    let questionInfo = document.getElementById('info'+turn);
    let title = "<p> Title: " + movieResponse.title + "</p>";
    questionInfo.insertAdjacentHTML('afterbegin', title);

    let date = "<p> Release date : " + movieResponse.release_date + "</p>";
    questionInfo.insertAdjacentHTML('afterbegin', date);

    let img = "<img id=image"+turn+" src='"+imageStart + movieResponse.poster_path+"'/>";
    questionInfo.insertAdjacentHTML('beforeend',img);

    //add question/input explaination
    let formInfo = document.getElementById('form'+turn);
    let question = "<p><spam id=help"+turn+"> Enter the name of an actor/director of the film above: </spam></p>";
    formInfo.insertAdjacentHTML('beforeend',question);

    //------------> Prepare answer for new question
    //Prepare the answer for the next check answer
    url = querryCastStart  + idMovie + querryCastEnd;
    castResponse = await fetch(url).then(OnSuccess, onError).then(ReadOnSuccess);

    //console.log("URL movie cast : ", url);


  } 
  //-----------------------------> CAS 2 : After Movies question type -> actors question type 
  else if(question == "guessMovie"){ //guess a movie where the previous acotr is in it
    //console.log("Actors image FILL");

    //------------> Fill new question 
    //Search for actor/directors infos:
    let url = querryPeopleStart + idPerson +querryPeopleEnd;
    let personResponse = await fetch(url).then(OnSuccess, onError).then(ReadOnSuccess);

    //console.log("URL actors/directors (that you guess previously): ", url);
    
    //Fill html with actor/directors name and photo 
    let questionInfo = document.getElementById('info'+turn);

    //add info
    let name = "<p> Name : " + personResponse.name + "</p>";
    questionInfo.insertAdjacentHTML('afterbegin', name);

    let img = "<img id=image"+turn+" src='"+imageStart + personResponse.profile_path+"'/>";
    questionInfo.insertAdjacentHTML('beforeend',img);


    //add question/input explaination
    let formInfo = document.getElementById('form'+turn);
    let question = "<p><spam id=help> Enter a movie related to the actor/director above: </spam></p>";
    formInfo.insertAdjacentHTML('beforeend',question);


    //------------> Prepare answer for new question
    //Prepare the answer for the next check answer = all movie related to that person
    url = querryActorsMoviesStart+idPerson+querryActorsEnd;
    //console.log("URL its movies : ", url);

    moviesResponse = await fetch(url).then(OnSuccess, onError).then(ReadOnSuccess);

  }

  //Re create the enter function with the new sumbit
  var input = document.getElementById("submit");

  // Execute a function when the user releases a key on the keyboard
  input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();

      //If the answer is correct, click on next
      if (document.getElementById("next").disabled == false)
      {
        Next();
        //document.getElementById("next").click();
      }
      else{
        // Trigger the button element with a click
        document.getElementById("check").click();
        //call the check function
        //CheckAnswer();
      }
    }
  });


}


//-----------------------------> READ JSON FUNCTION <------------------------------
function OnSuccess(response){
  return response.json();
}
function onError(error){
  console.log('Error:'+error);
}

function ReadOnSuccess(response){
  return response;
}

