class Card {
  constructor(cardNumber, cardsCount, clickListener) {
    const div = document.createElement('div');
    div.classList.add(`cards${cardsCount}`, 'card');
    div.addEventListener('click', clickListener);
    div.id = `div${cardNumber}`;
    const backImg = document.createElement('img');
    backImg.src = 'img/js-badge.svg';
    backImg.alt = cardNumber;
    backImg.classList.add('backImg');
    div.appendChild(backImg);
    this.div = div;
    this.clickListener = clickListener;
    this.hiddenValue = undefined;
    this.opened = false;
    this.visible = true;
  }

  open() {
    this.div.classList.add('flip');
    this.opened = true;
  }

  close() {
    this.div.classList.remove('flip');
    this.opened = false;
  }

  hide() {
    this.div.classList.add('hidden');
    this.visible = false;
    this.opened = false;
    this.div.removeEventListener('click', this.clickListener);
  }

  setFrontImage(hiddenValue) {
    this.hiddenValue = hiddenValue;
    const frontImg = document.createElement('img');
    frontImg.src = `img/${hiddenValue}.svg`;
    frontImg.alt = hiddenValue;
    frontImg.classList.add('frontImg');
    this.div.appendChild(frontImg);
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
    this.cards.forEach((card, i) => card.setFrontImage(this.imagesRandomised[i]));
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
    this.imagesPreloaded = [];
    this.preloadImages();
  }

  preloadImages() {
    const pathes = [];
    pathes.push('img/js-badge.svg');
    for(let i = 0; i<15; i += 1) {
      pathes.push(`img/${i}.svg`);
    }
    pathes.forEach(path => {
      this.imagesPreloaded.push(new Image().src = 'path');
    });
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
    this.imagesPreloaded = undefined;
  }

  createCards() {
    const fragment = document.createDocumentFragment();
    const cards = Array(this.cardsCount)
      .fill(0).map((_, index) => new Card(index, this.cardsCount, this.clickListenerBinded));
    cards.forEach(card => fragment.appendChild(card.div));
    const mainContainer = document.getElementById('cardsContainer');
    mainContainer.appendChild(fragment);
    return cards;
  }

  clickListener(event) {
    const idClicked = parseInt(event.target.parentElement.id.slice(3), 10);
    this.game.imageOnClickBinded(idClicked);
  }
}


// eslint-disable-next-line no-new
new DOMManager();
