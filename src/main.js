class Timer {
  constructor() {
    this.started = false;
  }

  startTimer() {
    const pageTimer = document.getElementById('timer');
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
class DOMManager {
  constructor() {
    this.cardsCountVar = document.getElementsByClassName('card').length;
    this.clickListenerBinded = this.clickListener.bind(this);
    this.imgs = [];
    for (let i = 0; i < this.cardsCountVar; i += 1) {
      this.imgs.push(document.getElementById(`img${i}`));
    }
  }

  setListeners(imageOnClick) {
    this.imageOnClick = imageOnClick;
    this.imgs.forEach((img) => {
      img.addEventListener('click', this.clickListenerBinded);
    });
  }

  clickListener(event) {
    const idClicked = parseInt(event.target.id.slice(3), 10);
    this.imageOnClick(idClicked);
  }

  get cardsCount() {
    return this.cardsCountVar;
  }

  showFace(cardNumber, srcFileNumber) {
    this.imgs[cardNumber].src = `img/${srcFileNumber}.svg`;
  }

  showBack(cardNumber) {
    this.imgs[cardNumber].src = 'img/js-badge.svg';
  }

  hideCard(cardNumber) {
    this.imgs[cardNumber].removeEventListener('click', this.clickListener);
    this.imgs[cardNumber].classList.add('hidden');
  }
}
class Game {
  constructor() {
    this.imageOnClickBinded = this.imageOnClick.bind(this);
    this.imagesRandomised = [];
    this.nowOpened = 0;
    this.timer = new Timer();
    this.DOMManagerInst = new DOMManager();
    this.DOMManagerInst.setListeners(this.imageOnClickBinded);
    this.numCards = this.DOMManagerInst.cardsCount;
    this.fillImagesRandom();
  }

  fillImagesRandom() {
    const imageNumbers = [];
    for (let i = 0; i < 6; i += 1) {
      imageNumbers.push(i);
      imageNumbers.push(i);
    }
    for (let i = this.numCards - 1; i >= 0; i -= 1) {
      const num = Math.round(Math.random() * i);
      this.imagesRandomised.push(imageNumbers[num]);
      imageNumbers.splice(num, 1);
    }
  }

  imageOnClick(idClicked) {
    if (!this.timer.isStarted) {
      this.timer.startTimer();
    }
    if (idClicked === this.prevClicked) return;
    this.nowOpened += 1;
    if (this.nowOpened > 2) {
      this.nowOpened = 2;
      return;
    }
    this.DOMManagerInst.showFace(idClicked, this.imagesRandomised[idClicked]);
    if (this.nowOpened === 1) {
      this.prevClicked = idClicked;
      return;
    }
    if (this.imagesRandomised[idClicked] !== this.imagesRandomised[this.prevClicked]) {
      setTimeout(() => this.returnBackImage(idClicked), 1000);
      return;
    }
    setTimeout(() => {
      this.DOMManagerInst.hideCard(idClicked);
      this.DOMManagerInst.hideCard(this.prevClicked);
      this.prevClicked = undefined;
      this.nowOpened = 0;
      this.numCards -= 2;
      if (!this.numCards) {
        this.timer.stopTimer();
      }
    }, 300);
  }

  returnBackImage(idClicked) {
    this.DOMManagerInst.showBack(idClicked);
    this.DOMManagerInst.showBack(this.prevClicked);
    this.prevClicked = undefined;
    this.nowOpened = 0;
  }
}


// eslint-disable-next-line no-new
new Game();
