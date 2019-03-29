class Card {
  constructor(cardNumber, cardsCount, clickListener) {
    const img = document.createElement('img');
    img.src = 'img/js-badge.svg';
    img.alt = cardNumber;
    img.id = `img${cardNumber}`;
    img.classList.add(`cards${cardsCount}`, 'card');
    img.addEventListener('click', clickListener);
    this.clickListener = clickListener;
    this.img = img;
    this.cardNumber = cardNumber;
    this.opened = false;
    this.visible = true;
  }

  open() {
    this.img.src = `img/${this.hiddenValue}.svg`;
    this.opened = true;
  }

  close() {
    this.img.src = 'img/js-badge.svg';
    this.opened = false;
  }

  hide() {
    this.img.classList.add('hidden');
    this.visible = false;
    this.opened = false;
    this.img.removeEventListener('click', this.clickListener);
  }

  setHiddenValue(hiddenValue) {
    this.hiddenValue = hiddenValue;
  }
}
class Timer {
  constructor() {
    this.started = false;
  }

  startTimer() {
    const pageTimer = document.getElementById('timer');
    pageTimer.classList.remove('hidden');
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
  }

  start(cards) {
    this.cards = cards;
    this.cardsCount = cards.length;
    this.imagesRandomised = [];
    this.fillImagesRandom();
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
    let i = 0;
    this.cards.forEach((card) => {
      card.setHiddenValue(this.imagesRandomised[i]);
      i += 1;
    });
  }

  imageOnClick(idClicked) {
    if (idClicked === this.prevClicked) return;
    if (this.openedCards === 2) return;
    this.cards[idClicked].open();
    if (this.openedCards === 1) {
      this.prevClicked = idClicked;
      return;
    }
    if (!this.cardsEqual(this.prevClicked, idClicked)) {
      setTimeout(() => this.returnBackImage(idClicked), 1000);
      return;
    }
    setTimeout(() => {
      this.cards[idClicked].hide();
      this.cards[this.prevClicked].hide();
      this.prevClicked = undefined;
      if (!this.visibleCards) {
        this.timer.stopTimer();
      }
    }, 300);
  }

  cardsEqual(cardIndex1, cardIndex2) {
    return this.cards[cardIndex1].hiddenValue === this.cards[cardIndex2].hiddenValue;
  }

  returnBackImage(idClicked) {
    this.cards[idClicked].close();
    this.cards[this.prevClicked].close();
    this.prevClicked = undefined;
  }

  get openedCards() {
    return this.cards.filter(a => a.opened).length;
  }

  get visibleCards() {
    return this.cards.filter(a => a.visible).length;
  }
}


class DOMManager {
  constructor() {
    this.clickListenerBinded = this.clickListener.bind(this);
    this.submitOnClickBinded = this.submitOnClick.bind(this);
    this.game = new Game();
    document.getElementById('Easy').addEventListener('change', DOMManager.difficultOnChange);
    document.getElementById('Medium').addEventListener('change', DOMManager.difficultOnChange);
    document.getElementById('Hard').addEventListener('change', DOMManager.difficultOnChange);
    document.getElementById('submit').addEventListener('click', this.submitOnClickBinded);
  }

  static difficultOnChange() {
    document.getElementById('submit').disabled = false;
  }

  submitOnClick() {
    const selectedDiff = document.querySelectorAll('input[name="difficulty"]:checked');
    this.cardsCount = parseInt(selectedDiff[0].value, 10);
    document.getElementById('modalContainer').classList.add('hidden');
    const cards = this.createCards();
    this.game.start(cards);
  }

  createCards() {
    const fragment = document.createDocumentFragment();
    const cards = Array(this.cardsCount)
      .fill(0).map((_, index) => new Card(index, this.cardsCount, this.clickListenerBinded));
    cards.forEach(card => fragment.appendChild(card.img));
    const mainContainer = document.getElementById('cardsContainer');
    mainContainer.appendChild(fragment);
    return cards;
  }

  clickListener(event) {
    const idClicked = parseInt(event.target.id.slice(3), 10);
    this.game.imageOnClickBinded(idClicked);
  }
}


// eslint-disable-next-line no-new
new DOMManager();
