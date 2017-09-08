var quesIndex;
var gameTimer;
var timeAllotted = 30; //seconds

//--------------------------------------------------------------------------------
//question data
//--------------------------------------------------------------------------------
var questionBank = [
 {
   question:"What is the capital of Alaska?",
   answers:[
     {ansID: 1000, answer:"Anchorage"},
     {ansID: 1001, answer:"Barrow"},
     {ansID: 1002, answer:"Juneau"},
     {ansID: 1003, answer:"Fairbanks"},
   ],
   correct: 1002,
   selected: null,
   reason: "It's Juneau, which still has a population of less than 33,000. Yikes."
 },
 {
   question:"Who founded the US Treasury?",
   answers:[
     {ansID: 1003, answer:"James Madison"},
     {ansID: 1004, answer:"Alexander Hamilton"},
     {ansID: 1005, answer:"Benjamin Franlkin"},
     {ansID: 1006, answer:"Andrew Jackson"},
   ],
   correct: 1004,
   selected: null,
   reason: "Alexander Hamilton was a major contrinutor to the strucure of the formative years of the US government. Arguably his largest contribution, apart from being a major contributor to maturing the constitution itself, was managing and growing the fledgling US credit system."
 },
 {
   question:"Who is the first American born president?",
   answers:[
     {ansID: 1007, answer:"George Washington"},
     {ansID: 1008, answer:"Thomas Jefferson"},
     {ansID: 1009, answer:"Andrew Jackson"},
     {ansID: 1010, answer:"Martin Van Buren"},
   ],
   correct: 1010,
   selected: null,
   reason: "Martin Van Buren was born in December 5th, 1782 in Kinderhook, NY. The first president not born under British rule and the first president not of British ancestry. He was of Dutch lineage."
 },     
 {
   question:"Which was not a part of the original 13 colonies?",
   answers:[
     {ansID: 1011, answer:"Vermont"},
     {ansID: 1012, answer:"Georgia"},
     {ansID: 1012, answer:"North Carolina"},
     {ansID: 1013, answer:"Pennsylvania"},
   ],
   correct: 1011,
   selected: null,
   reason: "Vermont was the 14th state which joined on March 4th, 1791."
 },  
 {
   question: "How many time zones does the USA have?",
   answers:[
     {ansID: 1014, answer:"Three"},
     {ansID: 1015, answer:"Four"},
     {ansID: 1016, answer:"Five"},
     {ansID: 1017, answer:"Six"},
   ],
   correct: 1017,
   selected: null,
   reason: "Eastern, Central, Mountain, Pacific, Alaskan, and Hawaii-Aleutian" 
 },    
];

//--------------------------------------------------------------------------------
//helper functions
//--------------------------------------------------------------------------------

function populateQuestionDetails() {
  $("#answer-response").hide();
  
  $("#question-container").empty();
  $("#answers-container").empty();
  $("#answer-response").empty();
  
  $("#question-container").html(questionBank[quesIndex].question);
  
  var quesAnswers = questionBank[quesIndex].answers;
  
  for (var i=0; i < quesAnswers.length; i++) {
    $("#answers-container").append('<div class="answer" data-content="' + quesAnswers[i].ansID + '">' + quesAnswers[i].answer + '</div>');
  }
  
  renderQuesControls();
}

function updateClock() {
  timeAllotted--;
  $("#game-timer").html(timeAllotted);
  if (timeAllotted === 0) {
    clearInterval(gameTimer);
    endGame();
  }
}

function renderQuesControls() {
  if (quesIndex === 0) {
    $("#previousQ").hide();
    $("#nextQ").show();
  } else if (quesIndex === questionBank.length-1) {
    $("#previousQ").show();
    $("#nextQ").hide();     
    $("#finish").show();
  } else {
    $("#previousQ").show();
    $("#nextQ").show();    
  }
  // console.log("quesIndex: " + quesIndex + " length: " + questionBank.length);
}

function getPreviousQuestion() {
  quesIndex--;
  populateQuestionDetails();
}

function getNextQuestion() {
  quesIndex++;
  populateQuestionDetails();
}

function processAnswer() {
  var selectedAnsID = parseInt($(this).attr("data-content"));
  var correctAnsID = questionBank[quesIndex].correct;
  
  if (selectedAnsID === correctAnsID) {
      $("#answer-response").html("<h4>Correct!</h4>");
  } else {
      $("#answer-response").html("<h4>Sorry that's not right.</h4>");
  }
  
  $("#answer-response").append(questionBank[quesIndex].reason);
  $("#answer-response").show();
  
  //save the answer the user selected in the questionBank
  questionBank[quesIndex].selected = selectedAnsID;
  
  console.log(questionBank[quesIndex].selected);
}

function endGame() {
  $("#main-game").hide();
  processResults();
  $("#results-display").show();
}

//--------------------------------------------------------------------------------
//event driven handlers below
//--------------------------------------------------------------------------------

$(document).ready(function () {
	//pre init routine
	$("#main-game").hide();
	$("#results-display").hide();
	$("#previousQ").hide();
	$("#nextQ").hide();
	$("#finish").hide();

	$("#start").on("click", function () {
	  $("#splash-screen").hide();
	  $("#main-game").show();

	  gameTimer = setInterval(updateClock, 1000);

	  quesIndex = 0;
	  populateQuestionDetails(quesIndex);

	});

	/*
	Here's a neat trick: for elements that are dynamically created existing handlers pointed to that 
	type of element (via class or id, whichever) will not be automatically bound. 

	Instead of $("[.|#]identifier").on("click", function) bind it to the document for it's id/class 
	as shown below.
	*/
	$(document).on("click", ".answer", processAnswer);

	$("#previousQ").on("click", getPreviousQuestion);

	$("#nextQ").on("click", getNextQuestion);

	$("#finish").on("click", endGame);

	$("#restart").on("click", function () {
	  console.log("reload the game.");
	  window.location.reload()
	});
});

//hiding this down here cause I'm not proud of it. -RT
function processResults() {
  var status;
  var correct = 0;
  var incorrect = 0;
  var score = 0;
  
  for (var i=0; i < questionBank.length; i++) {
    if (questionBank[i].correct === questionBank[i].selected) {
      correct++;
      status = "Correct!";
    } else {
      incorrect++;
      status = "Incorrect!";
    }
    
    //sorry the below is verbose. I know :( I could only see so far ahead. If I had more time I'd refactor it to end cleaner.
    
    if (questionBank[i].selected !== null) {
      //get selected text
      var selectedText = "NA";
      for (var j=0; j < questionBank[i].answers.length; j++) {
        if (questionBank[i].answers[j].ansID === questionBank[i].selected) {
          selectedText = questionBank[i].answers[j].answer;
          break;
        }
      }
    } else {
      selectedText = "--";
    }         
    //get correct ans text
    var correctText = "NA";
    for (var k=0; k < questionBank[i].answers.length; k++) {
      if (questionBank[i].answers[k].ansID === questionBank[i].correct) {
        correctText = questionBank[i].answers[k].answer;
        break;
      }
    }
    
    $("#result-rows").append("<tr><td>" + questionBank[i].question + "</td><td>" + selectedText + "</td><td>" + correctText + "</td><td>" + status + "</td></tr>");
  }
  
}//processResults