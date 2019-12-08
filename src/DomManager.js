import Game from './Game';
import Card from './Card';

export default class DOMManager {
  constructor() {
    this.cardOnClick = this.cardOnClick.bind(this);
    this.submitOnClick = this.submitOnClick.bind(this);
    this.game = new Game();
    document
      .getElementById('Easy')
      .addEventListener('change', DOMManager.difficultOnChange);
    document
      .getElementById('Medium')
      .addEventListener('change', DOMManager.difficultOnChange);
    document
      .getElementById('Hard')
      .addEventListener('change', DOMManager.difficultOnChange);
    document
      .getElementsByClassName('submit')[0]
      .addEventListener('click', this.submitOnClick);
    this.imagesPreloaded = [];
    this.preloadImages();
  }

  submitOnClick() {
    const selectedDiff = document.querySelector(
      'input[name="difficulty"]:checked',
    );
    this.cardsCount = parseInt(selectedDiff.value, 10);
    document
      .getElementsByClassName('difficulty-container')[0]
      .classList.add('difficulty-container__hidden');
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
      .fill(0)
      .map((_, index) => new Card(index, this.cardsCount, this.cardOnClick));
    this.game.appendImages(cards);
    cards.forEach((card) => fragment.appendChild(card.div));
    const mainContainer = document.getElementsByClassName(
      'cards-container__inner-container',
    )[0];
    mainContainer.appendChild(fragment);
  }
}
