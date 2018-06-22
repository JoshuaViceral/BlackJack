/* Blackjack by Joshua Viceral */

// ================================================
// DOM variables
const newGameButton = document.getElementById('new-game-button');
const hitButton = document.getElementById('hit-button');
const stayButton = document.getElementById('stay-button');
const textArea = document.getElementById('text-area');
const player1Data = document.getElementById('player1-data');
const player2Data = document.getElementById('player2-data');
const displayData = document.getElementsByClassName('disp-data');

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
player.name = prompt('Enter your name:', 'Player One');

const dealer = new Person();
dealer.name = 'Dealer';


// ================================================
// functions
function createDeck() {
  const newDeck = [];
  const suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
  const ranks = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four', 'Three', 'Two'];
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
    case 'Ace': return 11;
    case 'Nine': return 9;
    case 'Eight': return 8;
    case 'Seven': return 7;
    case 'Six': return 6;
    case 'Five': return 5;
    case 'Four': return 4;
    case 'Three': return 3;
    case 'Two': return 2;
    // for Ten, Jack, Queen, and King
    default: return 10;
  }
}

function printCardName(card) {
  return `${card.rank} of ${card.suit}`;
}

function printPersonData(person) {
  let text = `${person.name}'s Hand:\n`;
  for (let i = 0; i < person.cards.length; i++) {
    text += `${printCardName(person.cards[i])}\n`;
  }
  text += `Score: ${person.score}`;
  return text;
}

function initializeDOM() {
  displayData[0].style.display = 'none';
  displayData[1].style.display = 'none';

  newGameButton.style.display = 'block';
  hitButton.style.display = 'none';
  stayButton.style.display = 'none';
  textArea.innerText = "Let's Play!";
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
  player1Data.innerText = printPersonData(player);
  player2Data.innerText = printPersonData(dealer);
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
// asdfasdf
// asdfasdfasdfasdf