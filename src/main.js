class Card {
  constructor(cardNumber, cardsCount, clickListener) {
    const div = document.createElement('div');
    div.classList.add(`card__card-container--quantity-${cardsCount}`, 'card__card-container', 'card__card-container--scale');
    div.addEventListener('click', clickListener);
    div.id = `div${cardNumber}`;
    this.div = div;
    this.clickListener = clickListener;
    this.hiddenValue = undefined;
    this.opened = false;
    this.visible = true;
  }

  open() {
    this.div.classList.add('card__card-container--flip');
    this.div.classList.remove('card__card-container--scale');
    this.opened = true;
  }

  close() {
    this.div.classList.remove('card__card-container--flip');
    this.div.classList.add('card__card-container--scale');
    this.opened = false;
  }

  hide() {
    this.div.classList.add('card__card-container--hidden');
    this.visible = false;
    this.opened = false;
    this.div.removeEventListener('click', this.clickListener);
  }

  setFrontImage(hiddenValue) {
    this.hiddenValue = hiddenValue;
    const frontImg = document.createElement('img');
    frontImg.src = `img/${hiddenValue}.svg`;
    frontImg.alt = hiddenValue;
    frontImg.classList.add('card__front-img');
    this.div.appendChild(frontImg);
  }

  setBackImage() {
    const backImg = document.createElement('img');
    backImg.src = 'img/js-badge.svg';
    backImg.alt = 'backImg';
    backImg.classList.add('card__back-img');
    this.div.appendChild(backImg);
  }
}

class Timer {
  constructor() {
    this.started = false;
  }

  startTimer() {
    const pageTimer = document.getElementsByClassName('cards-container__timer')[0];
    pageTimer.classList.remove('cards-container__timer--hidden');
    let numSec = 0;
    this.intStarted = setInterval(() => {
      numSec += 1;
      let minutes = Math.floor(numSec / 60);
      if (minutes < 10) minutes = `0${minutes}`;
      let seconds = numSec % 60;
      if (seconds < 10) seconds = `0${seconds}`;
      const timerValue = `${minutes}:${seconds}`;
      pageTimer.firstChild.data = timerValue;
    }, 1000);
    this.started = true;
  }

  stopTimer() {
    clearInterval(this.intStarted);
    this.started = false;
  }

  get isStarted() {
    return this.started;
  }
}

class Game {
  constructor() {
    this.imageOnClickBinded = this.imageOnClick.bind(this);
    this.timer = new Timer();
    this.fieldIsBlocked = false;
  }

  appendImages(cards) {
    this.cards = cards;
    this.cardsCount = cards.length;
    this.imagesRandomised = [];
    this.fillImagesRandom();
    this.cards.forEach((card, i) => {
      card.setFrontImage(this.imagesRandomised[i]);
      card.setBackImage();
    });
  }

  start() {
    this.timer.startTimer();
  }

  fillImagesRandom() {
    const imageNumbers = [];
    for (let i = 0; i < this.cardsCount / 2; i += 1) {
      imageNumbers.push(i);
      imageNumbers.push(i);
    }
    for (let i = this.cardsCount - 1; i >= 0; i -= 1) {
      const num = Math.round(Math.random() * i);
      this.imagesRandomised.push(imageNumbers[num]);
      imageNumbers.splice(num, 1);
    }
  }

  imageOnClick(idClicked) {
    if (this.fieldIsBlocked) return;
    switch (this.openedCardsNum) {
      case 0:
        this.cards[idClicked].open();
        return;
      case 1:
        if (this.isCardOpened(idClicked)) return;
        this.cards[idClicked].open();
        this.fieldIsBlocked = true;
        this.checkCards();
        break;
      default:
    }
  }

  isCardOpened(cardId) {
    const openedCardId = parseInt(this.openedCards[0].div.id.slice(3), 10);
    return openedCardId === cardId;
  }

  checkCards() {
    if (!this.areCardsEqual()) {
      setTimeout(() => this.returnBackImage(), 1000);
      return;
    }
    setTimeout(() => this.hideGuessedCards(), 600);
  }

  areCardsEqual() {
    const hiddenValuesOfOpened = this.openedCards
      .map(card => card.hiddenValue);
    return hiddenValuesOfOpened[0] === hiddenValuesOfOpened[1];
  }

  returnBackImage() {
    const { openedCards } = this;
    openedCards[0].close();
    openedCards[1].close();
    this.fieldIsBlocked = false;
  }

  hideGuessedCards() {
    const { openedCards } = this;
    openedCards[0].hide();
    openedCards[1].hide();
    this.fieldIsBlocked = false;
    if (!this.visibleCardsNum) {
      this.timer.stopTimer();
    }
  }

  get openedCardsNum() {
    return this.openedCards.length;
  }

  get openedCards() {
    return this.cards.filter(a => a.opened);
  }

  get visibleCardsNum() {
    return this.cards.filter(a => a.visible).length;
  }
}

class DOMManager {
  constructor() {
    this.cardOnClick = this.cardOnClick.bind(this);
    this.submitOnClick = this.submitOnClick.bind(this);
    this.game = new Game();
    document.getElementById('Easy').addEventListener('change', DOMManager.difficultOnChange);
    document.getElementById('Medium').addEventListener('change', DOMManager.difficultOnChange);
    document.getElementById('Hard').addEventListener('change', DOMManager.difficultOnChange);
    document.getElementsByClassName('submit')[0].addEventListener('click', this.submitOnClick);
    this.imagesPreloaded = [];
    this.preloadImages();
  }

  submitOnClick() {
    const selectedDiff = document.querySelector('input[name="difficulty"]:checked');
    this.cardsCount = parseInt(selectedDiff.value, 10);
    document.getElementsByClassName('difficulty-container')[0].classList.add('difficulty-container__hidden');
    this.createCards();
    this.game.start();
    this.imagesPreloaded = undefined;
  }

  cardOnClick(event) {
    const idClicked = parseInt(event.target.parentElement.id.slice(3), 10);
    this.game.imageOnClickBinded(idClicked);
  }

  preloadImages() {
    const pathes = [];
    pathes.push('img/js-badge.svg');
    for (let i = 0; i < 15; i += 1) {
      pathes.push(`img/${i}.svg`);
    }
    pathes.forEach((path) => {
      const image = new Image();
      image.src = path;
      this.imagesPreloaded.push(image);
    });
  }

  static difficultOnChange() {
    document.getElementsByClassName('submit')[0].disabled = false;
  }

  createCards() {
    const fragment = document.createDocumentFragment();
    const cards = Array(this.cardsCount)
      .fill(0).map((_, index) => new Card(index, this.cardsCount, this.cardOnClick));
    this.game.appendImages(cards);
    cards.forEach(card => fragment.appendChild(card.div));
    const mainContainer = document.getElementsByClassName('cards-container__inner-container')[0];
    mainContainer.appendChild(fragment);
  }
}


// eslint-disable-next-line no-new
new DOMManager();
