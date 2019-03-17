class Game {
    constructor() {
        this.imageOnClickBinded = this.imageOnClick.bind(this);
        this.imagesRandomised = [];
        this.fillImagesRandom();     
        this.nowOpened = 0;      
        this.timer=new Timer();
        this.DOMManagerInst = new DOM_Manager;
        this.DOMManagerInst.setListener(this.imageOnClickBinded);
        this.numCards = this.DOMManagerInst.cardsCount;
    }

    fillImagesRandom() {
        const imageNumbers = [];
        for(let i=0; i<6;i++) {
            imageNumbers.push(i);
            imageNumbers.push(i);
        }
        let num;
        for(let i=11;i>=0;i--) {
            num = Math.round(Math.random() * i);
            this.imagesRandomised.push(imageNumbers[num]);
            imageNumbers.splice(num, 1);
        }
    }
    imageOnClick(event) {
        if(!this.timer.isStarted) {
            this.timer.startTimer();
        }
        
        let idClicked = parseInt(event.target.id.slice(3));
        if(idClicked === this.prevClicked) return;
        this.nowOpened++;
        if(this.nowOpened > 2) {
            this.nowOpened = 2;
            return;
        }
        this.DOMManagerInst.showFace(idClicked, this.imagesRandomised[idClicked]);
        if(this.nowOpened===1) {
            this.prevClicked = idClicked;
            return;
        }
        if(this.imagesRandomised[idClicked] !== this.imagesRandomised[this.prevClicked]) {
            setTimeout(() => {this.returnBackImage(idClicked)},1000);
            return;
        }
        setTimeout(() => {
            this.DOMManagerInst.hideCards(idClicked, this.prevClicked);
            this.prevClicked = undefined;
            this.nowOpened = 0;
            this.numCards-=2;
            if(!this.numCards) {
                this.timer.stopTimer();
            }
        }, 300);
    }
    returnBackImage(idClicked) {
        this.DOMManagerInst.showBacks(idClicked, this.prevClicked);
        this.prevClicked = undefined;
        this.nowOpened = 0;
    }
}

class Timer {
    constructor() {
        this.started = false;
    }
    startTimer() {
        let pageTimer=document.getElementById("timer");
        let numSec = 0;
        this.intStarted = setInterval(function(){
            numSec++;
            let minutes=Math.floor(numSec/60);
            if(minutes<10) minutes='0'+ minutes;
            let seconds=numSec % 60;
            if(seconds<10) seconds='0'+ seconds;
            let timerValue=`${minutes}:${seconds}`;
            pageTimer.firstChild.data=timerValue;
        },1000);
        this.started = true;
    }
    stopTimer() {
        clearInterval(this.intStarted);
        this.started = false;
    }
    get isStarted(){
        return this.started;
    }
}

class DOM_Manager {
    constructor() {
        this.cardsCountVar = document.getElementsByClassName("card").length;
        this.imgs = [];
        for(let i=0;i<this.cardsCountVar;i++){
            this.imgs.push(document.getElementById("img"+i));
        }
    }
    setListener(fun) {
        for(let img of this.imgs) {
            img.addEventListener('click', fun);
        }
    }
    get cardsCount() {
        return this.cardsCountVar;
    }
    showFace(cardNumber, srcFileNumber) {
        this.imgs[cardNumber].src = 'img/' + srcFileNumber + '.svg';
    }
    showBacks(cardNumber1, cardNumber2){
        this.imgs[cardNumber1].src = 'img/js-badge.svg';
        this.imgs[cardNumber2].src = 'img/js-badge.svg';
    }
    hideCards(cardNumber1, cardNumber2) {
        this.imgs[cardNumber1].removeEventListener('click', this.imageOnClickBinded);
        this.imgs[cardNumber1].classList.add("hidden");
        this.imgs[cardNumber2].removeEventListener('click', this.imageOnClickBinded);
        this.imgs[cardNumber2].classList.add("hidden");
    }
}

const objGame = new Game();
