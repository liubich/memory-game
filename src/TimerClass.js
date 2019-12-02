export class Timer {
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
