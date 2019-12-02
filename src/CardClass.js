export default class Card {
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
