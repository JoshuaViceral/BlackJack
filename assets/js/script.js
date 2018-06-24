/* Blackjack by Joshua Viceral */

// ================================================
// DOM variables
const newGameButton = document.getElementById('new-game-button');
const hitButton = document.getElementById('hit-button');
const stayButton = document.getElementById('stay-button');
const textArea = document.getElementById('text-area');
const player1Data = document.getElementById('player-data');
const player2Data = document.getElementById('dealer-data');
const displayData = document.getElementsByClassName('disp-data');
const playerCards = document.querySelector('.js-player-cards');
const dealerCards = document.querySelector('.js-delear-cards');

// ================================================
// game variables
let deck = [];
let endOfTurn = false;
let gameOver = false;

// ================================================
// Prototypes
const Person = function () {
  this.name = '';
  this.cards = [];
};

Object.defineProperty(Person.prototype, 'score', {
  get() {
    let acc = 0;
    for (let i = 0; i < this.cards.length; i++) {
      const element = this.cards[i];
      acc += convertRanktoValue(element.rank);
    }
    return acc;
  },
});

// ==============================================
// Create players
const player = new Person();
const dealer = new Person();
dealer.name = 'Dealer';

// ================================================
// functions
function createDeck() {
  const newDeck = [];
  const suits = ['S', 'C', 'D', 'H'];
  const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  for (let suitsIndex = 0; suitsIndex < suits.length; suitsIndex++) {
    for (let ranksIndex = 0; ranksIndex < ranks.length; ranksIndex++) {
      newDeck.push({ suit: suits[suitsIndex], rank: ranks[ranksIndex] });
    }
  }
  return newDeck;
}

function shuffle(arr) {
  const arrCopy = arr;
  for (let i = 0; i < arrCopy.length; i++) {
    // get random element from the array
    const randomIdx = Math.floor(Math.random() * arrCopy.length);
    const element = arrCopy[randomIdx];
    // swap the indexed element to a random element.
    arrCopy[randomIdx] = arrCopy[i];
    arrCopy[i] = element;
  }
  return arrCopy;
}

function drawCard(deckIn) {
  return deckIn.pop();
}

function convertRanktoValue(rank) {
  switch (rank) {
    case 'A': return 11;
    case '9': return 9;
    case '8': return 8;
    case '7': return 7;
    case '6': return 6;
    case '5': return 5;
    case '4': return 4;
    case '3': return 3;
    case '2': return 2;
    // for Ten, Jack, Queen, and King
    default: return 10;
  }
}

// ==============================================
// Render Image
function renderCardImage(card) {
  return `<img src="./assets/images/${card.rank}${card.suit[0].toUpperCase()}.png">`;
}

function printPersonData(person) {
  let text = `<h3>${person.name}'s Hand:</h3>`;
  for (let i = 0; i < person.cards.length; i++) {
    text += `${renderCardImage(person.cards[i])}`;
  }
  text += `<p>Score: ${person.score}</p>`;
  return text;
}

function initializeDOM() {
  displayData[0].style.display = 'none';
  displayData[1].style.display = 'none';

  newGameButton.classList.remove('is-hidden');
  newGameButton.classList.add('is-shown');

  hitButton.classList.remove('is-shown');
  hitButton.classList.add('is-hidden');

  stayButton.classList.remove('is-shown');
  stayButton.classList.add('is-hidden');

  textArea.classList.remove('is-hidden');
  textArea.classList.add('is-shown');
}

function checkResult() {
  const playerScore = player.score;
  const dealerScore = dealer.score;
  if (playerScore > 21) {
    textArea.innerText = 'You Lose...';
    gameOver = true;
  } else if (dealerScore > 21) {
    textArea.innerText = 'You Win!';
    gameOver = true;
  } else if (endOfTurn) {
    if (dealerScore < playerScore) {
      if (playerScore === 21) {
        textArea.innerText = 'You got a Blackjack! You Win!';
      } else {
        textArea.innerText = 'You Win!';
      }
    } else if (dealerScore === playerScore) {
      textArea.innerText = "It's a Tie!";
    } else if (dealerScore > playerScore) {
      textArea.innerText = 'You Lose...';
    }
    gameOver = true;
  }
  if (gameOver) {
    newGameButton.style.display = 'block';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}
function dealerTurn() {
  while (dealer.score < 17) {
    dealer.cards.push(drawCard(deck));
  }
}
// ==============================================
// initialize interface
initializeDOM();



// ==============================================
// Start a new game
newGameButton.addEventListener('click', () => {
  // make sure player inputs name
  while(!player.name) {
    player.name = prompt('Enter your name:', 'Player One');
  }

  // show game data
  displayData[0].style.display = 'block';
  displayData[1].style.display = 'block';
  // show game controls
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  // create and shuffle deck
  deck = createDeck();
  deck = shuffle(deck);
  // deal 2 cards for each person
  player.cards = [drawCard(deck), drawCard(deck)];
  dealer.cards = [drawCard(deck), drawCard(deck)];
  // show cards and scores for each person
  player1Data.innerHTML = printPersonData(player);
  player2Data.innerHTML = printPersonData(dealer);
  // restart flags
  gameOver = false;
  endOfTurn = false;
  textArea.innerText = 'Game Started...';
  // If player got a blackjack, the dealer will draw cards.
  if (player.score === 21) {
    endOfTurn = true;
    dealerTurn();
  }
  checkResult();
});

// the player can press hit to draw a card several times until he
// decides to stay, or until his score reaches 21 or higher.
stayButton.addEventListener('click', () => {
  endOfTurn = true;
  dealerTurn();
  player2Data.innerText = printPersonData(dealer);
  checkResult();
});

hitButton.addEventListener('click', () => {
  player.cards.push(drawCard(deck));
  player1Data.innerText = printPersonData(player);
  if (player.score === 21) {
    endOfTurn = true;
    dealerTurn();
  }
  checkResult();
});

