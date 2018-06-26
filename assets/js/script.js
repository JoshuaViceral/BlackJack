/* Blackjack by Joshua Viceral */

// ================================================
// DOM variables
const letsPlay = document.querySelector('.js-lets-play');
const gameStarted = document.querySelector('.js-game-started');
const gameOver = document.querySelector('.js-game-over');

const dealerData = document.querySelector('.js-dealer-data');
const dealerCards = document.querySelector('.js-dealer-cards');
const dealerScore = document.querySelector('.js-dealer-score');

const playerData = document.querySelector('.js-player-data');
const playerName = document.querySelector('.js-player-name');
const playerCards = document.querySelector('.js-player-cards');
const playerScore = document.querySelector('.js-player-score');

const resultWin = document.querySelector('.js-result-win');
const resultBlackjack = document.querySelector('.js-result-blackjack');
const resultLose = document.querySelector('.js-result-lose');
const resultTie = document.querySelector('.js-result-tie');

const newGameButton = document.querySelector('.js-new-game-button');
const hitButton = document.querySelector('.js-hit-button');
const stayButton = document.querySelector('.js-stay-button');

// ================================================
// Game variables
let deck = [];
let endOfTurn = false;
let endOfGame = false;

// ================================================
// Prototypes
const Person = function () {
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

  function score() {
    let total = 0;
    for (let i = 0; i < this.cards.length; i++) {
      total += convertRanktoValue(this.cards[i].rank);
    }
    return total;
  }

  return {
    score,
    name: '',
    cards: [],
  };
};

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

// Render Image
function renderCardImage(card) {
  return `<img src="./assets/images/${card.rank}${card.suit[0].toUpperCase()}.png">`;
}

function showHand(person) {
  let cards = '';
  for (let i = 0; i < person.cards.length; i++) {
    cards += renderCardImage(person.cards[i]);
  }
  return cards;
}

function showAllHands() {
  playerCards.innerHTML = showHand(player);
  dealerCards.innerHTML = showHand(dealer);
  dealerScore.innerHTML = dealer.score();
  playerScore.innerHTML = player.score();
}

function hideAllGameStatus() {
  letsPlay.classList.remove('show-block');
  gameStarted.classList.remove('show-block');
  gameOver.classList.remove('show-block');
}

function hideAllGameResults() {
  resultWin.classList.remove('show-block');
  resultBlackjack.classList.remove('show-block');
  resultLose.classList.remove('show-block');
  resultTie.classList.remove('show-block');
}

function hideAllGameButtons() {
  newGameButton.classList.remove('show-inline-block');
  hitButton.classList.remove('show-inline-block');
  stayButton.classList.remove('show-inline-block');
}

/* function checkScores() {
  const scorePlayer = player.score();
  const scoreDealer = dealer.score();
  if (!endOfTurn && scorePlayer > 21) {
    // check if player score exceeds 21, end the game
    endOfGame = true;
    resultLose.classList.add('show-block');
  } else if (!endOfTurn && scorePlayer === 21) {
    endOfTurn = true;
    resultWin.classList.add('show-block');
  } else if (endOfTurn && scoreDealer === scorePlayer) {
    endOfGame = true;
    resultTie.classList.add('show-block');
  } else if (endOfTurn && scorePlayer < 21 && scoreDealer < scorePlayer) {
    // if player score is below 21 and player decided to end the turn
    endOfGame = true;
    resultWin.classList.add('show-block');
  } else if (endOfTurn && scorePlayer < 21 && scoreDealer > scorePlayer) {
    endOfGame = true;
    resultLose.classList.add('show-block');
  } else if (endOfTurn && scorePlayer === 21 && scoreDealer < scorePlayer) {
    endOfGame = true;
    resultBlackjack.classList.add('show-block');
  }
} */

function isTurnDone() {
  const score = player.score();
  const lose = () => resultLose.classList.add('show-block');
  endOfTurn = score === 21;
  endOfGame = score > 21;
  if (endOfGame) { lose(); }
}

function checkScores() {
  const scorePlayer = player.score();
  const scoreDealer = dealer.score();
  const tie = () => resultTie.classList.add('show-block');
  const win = () => resultWin.classList.add('show-block');
  const lose = () => resultLose.classList.add('show-block');
  const blackjack = () => resultBlackjack.classList.add('show-block');

  if (scorePlayer === 21 && scoreDealer !== 21) { blackjack(); } else
  if (scorePlayer < scoreDealer && scoreDealer <= 21) { lose(); } else
  if (scorePlayer > scoreDealer || scoreDealer > 21) { win(); } else
  if (scorePlayer === scoreDealer) { tie(); }
}

function dealerTurn() {
  while (dealer.score() < 17) {
    dealer.cards.push(drawCard(deck));
  }
}

function init() {
  letsPlay.classList.add('show-block');
  newGameButton.classList.add('show-inline-block');
}

function showNewGameUI() {
  // show new game interface
  hideAllGameStatus();
  hideAllGameResults();
  hideAllGameButtons();
  gameStarted.classList.add('show-block');
  playerData.classList.add('show-block');
  dealerData.classList.add('show-block');
  hitButton.classList.add('show-inline-block');
  stayButton.classList.add('show-inline-block');
  endOfGame = false;
  endOfTurn = false;
}

function showEndGameUI() {
  hideAllGameButtons();
  newGameButton.classList.add('show-inline-block');
}
function checkPlayerName() {
  while (!player.name) {
    playerData.classList.remove('show-block');
    dealerData.classList.remove('show-block');
    player.name = prompt('Enter your name:', 'Player One');
  }
  playerName.innerHTML = player.name;
}

// ==============================================
// initialize
init();

// ==============================================
// Game actions

newGameButton.addEventListener('click', () => {
  // make sure player inputs name
  checkPlayerName();
  showNewGameUI();
  deck = createDeck();
  deck = shuffle(deck);
  player.cards = [drawCard(deck), drawCard(deck)];
  dealer.cards = [drawCard(deck), drawCard(deck)];
  showAllHands();
  isTurnDone();
  if (endOfTurn && !endOfGame) {
    dealerTurn();
    checkScores();
    endOfGame = true;
  }
  showAllHands();
  if (endOfGame) {
    showEndGameUI();
  }
});

stayButton.addEventListener('click', () => {
  endOfTurn = true;
  dealerTurn();
  checkScores();
  endOfGame = true;
  showAllHands();
  showEndGameUI();
});

hitButton.addEventListener('click', () => {
  player.cards.push(drawCard(deck));
  isTurnDone();
  if (endOfTurn && !endOfGame) {
    dealerTurn();
    checkScores();
    endOfGame = true;
  }
  showAllHands();
  if (endOfGame) {
    showEndGameUI();
  }
});


/* initial score is 11, 
then draws card.

even though score has not exceeded 21, the game ends without a result
*/