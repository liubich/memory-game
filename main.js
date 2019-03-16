class Game {
    constructor(imageContainers) {
        this.imageContainers = imageContainers;
        this.imageOnClickBinded = this.imageOnClick.bind(this);
        this.returnBackImageBinded = this.returnBackImage.bind(this);
        this.imagesRandomised = [];
        this.fillImagesRandom();
        this.setListenerOnClick();
        this.nowOpened = 0;
        this.started=false;
        this.numCards = imageContainers.length;
    }
    setListenerOnClick() {
        for(let imageContainer of this.imageContainers) {
            imageContainer.addEventListener('click', this.imageOnClickBinded);
        }
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
        if(!this.interval) {
            let timer=new Timer();
            this.interval = timer.startTimer();
        }
        
        let idClicked = parseInt(event.target.id.slice(3));
        if(idClicked === this.prevClicked) return;
        this.nowOpened++;
        if(this.nowOpened > 2) {
            this.nowOpened = 2;
            return;
        }
        event.target.src = 'img/' + this.imagesRandomised[idClicked] + '.svg';
    
        if(this.prevClicked === undefined) {
            this.prevClicked = idClicked;
            return;
        }
        if(this.imagesRandomised[idClicked] !== this.imagesRandomised[this.prevClicked]) {
            setTimeout(this.returnBackImageBinded,1000,idClicked);
            return;
        }
        setTimeout(() => {
            this.imageContainers[idClicked].removeEventListener('click', this.imageOnClickBinded);
            this.imageContainers[idClicked].classList.add("hidden");
            this.imageContainers[this.prevClicked].removeEventListener('click', this.imageOnClickBinded);
            this.imageContainers[this.prevClicked].classList.add("hidden");
            this.prevClicked = undefined;
            this.nowOpened = 0;
            this.numCards-=2;
            if(!this.numCards) {
                clearInterval(this.interval);
            }
        }, 300);  
    }
    returnBackImage(idClicked) {
        this.imageContainers[idClicked].src = 'img/js-badge.svg';
        this.imageContainers[this.prevClicked].src = 'img/js-badge.svg';
        this.prevClicked = undefined;
        this.nowOpened = 0;
    }
}

class Timer {
    constructor() {
    }
    startTimer() {
        let pageTimer=document.getElementById("timer");
        let numSec = 0;
        return setInterval(function(){
            numSec++;
            let minutes=Math.floor(numSec/60);
            if(minutes<10) minutes='0'+ minutes;
            let seconds=numSec % 60;
            if(seconds<10) seconds='0'+ seconds;
            let timerValue=`${minutes}:${seconds}`;
            pageTimer.firstChild.data=timerValue;
        },1000);
    }
}
const imgs = [];
for(let i=0;i<12;i++){
    imgs.push(document.getElementById('img'+i));
}
const objGame = new Game(imgs);
