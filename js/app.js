//variable declaration-get elements
const resetButton = document.querySelector('.restart');
const deck = document.querySelector('.deck');
const moves = document.getElementById('movesValue');
const score = document.getElementsByTagName('ul')[0];
let cards = document.querySelectorAll('.card');
let time = document.getElementById('timer'),
    seconds = 0,
    minutes = 0,
    hours = 0,
    t;

let movesCounter = 0;
let openCards = [];
let matchedCards = [];
let starsContent = `3 stars`;
let start = false;


const scoreHTML = `<li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>`;



//New game-restart function. Shuffles cards and resets: moves,timer,score.
function restartGame() {
    //shuffling cards
    for (let i = 0; i < deck.children.length; i++) {
        cards[i].className = "card";
        deck.appendChild(deck.children[Math.random() * i | 0]);
    }
    movesCounter = 0;
    openCards = [];
    matchedCards = [];
    moves.innerHTML = movesCounter;
    resetTimer();
    score.innerHTML = scoreHTML;
    start = false;
}



/*=========timer code=============================
 timer source code from https://jsfiddle.net/pvk6p/3590/
 with modifications*/

//reset timer
function resetTimer() {
    clearTimeout(t);
    time.innerHTML = "&emsp;00:00:00";
    seconds = 0;
    minutes = 0;
    hours = 0;
}

//stop timer
function stopTimer() {
    clearTimeout(t);
}

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    timer();
    time.innerHTML = "&emsp;" + (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

}

function timer() {
    t = setTimeout(add, 1000);
}

//===========Card code=============================================

/*changes the displayed number of moves
  changes the star rating depending on the moves number*/
function checkMoves() {
    movesCounter++;
    moves.innerHTML = movesCounter;
    if (movesCounter === 1) {
        moves.nextSibling.textContent = ' Move';
    } else if (movesCounter > 1) {
        moves.nextSibling.textContent = ' Moves';
        if (movesCounter === 15) {
            score.removeChild(score.children[0]);
            starsContent = `2 stars`;
        } else if (movesCounter === 25) {
            score.removeChild(score.children[1]);
            starsContent = `1 star`;
        }
    }
}


/*adds match class to all matched cards and
  checks if the player wins*/
function matching() {
    for (matchedCard of matchedCards) {
        matchedCard.classList.add('match');
    }
    //winning condition!Opens modal after 1 minute!
    if (matchedCards.length === 16) {
        stopTimer();
        setTimeout(openModal(), 1000);
    }
}


/*if the two cards match it moves them to the matchedCard Array
  if not,we close the card after 1s.
  Emptys the openCard array.*/
function check() {
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
        matchedCards.push(openCards[0], openCards[1]);
        matching();
        openCards = [];
    } else {
        setTimeout(function() {
            for (openCard of openCards) {
                openCard.className = "card";
            }
            openCards = [];;
        }, 1000);
    }

}

//shows cards and moves them to the openCards Array
function show(pCard) {
    if (openCards.length < 1) {
        openCards.push(pCard);
        pCard.classList.add('open', 'show');
    } else if (openCards.length === 1) {
        checkMoves();
        openCards.push(pCard);
        pCard.classList.add('open', 'show');
        check();
    }

}

//picks card and starts timer
function pickCard(evt) {
    let pickedCard = evt.target;
    if (pickedCard.classList.value === "card") {
        if (!start) {
            timer();
        }
        show(pickedCard);

    }
    return start = true;
}


//Add one event listener for all cards
deck.addEventListener('click', pickCard);

//Add listener to reset button
resetButton.addEventListener('click', restartGame);

//Game ready to play when document loaded
document.onload = restartGame();


/*==================Modal code============================================================
 *modal source code: https://codepen.io/bradtraversy/pen/zEOrPp ,
 *with modifications*/


// Get modal element and winning elements
let wintime = document.getElementById('winning-time');
let winmoves = document.getElementById('winning-moves');
let winstars = document.getElementById('winning-stars');
let modal = document.getElementById('simpleModal');

// Get new game button
let newGameBtn = document.getElementsByClassName('newGameBtn')[0];

// Listen for New game click
newGameBtn.addEventListener('click', closeModal);

// Listen for outside click
window.addEventListener('click', outsideClick);



// Function to open modal and display winning results
function openModal() {
    wintime.textContent = time.textContent;
    winmoves.textContent = movesCounter;
    winstars.textContent = starsContent;
    modal.style.display = 'block';
}

// Function to close modal and start New game
function closeModal() {
    modal.style.display = 'none';
    restartGame();
}

// Function to close modal and start new game if outside click
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
        restartGame();
    }
}
