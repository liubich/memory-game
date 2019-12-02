import Timer from './TimerClass';

export default class Game {
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
