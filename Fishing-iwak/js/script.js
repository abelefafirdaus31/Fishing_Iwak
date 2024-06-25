window.onload = function() {
    const gameContainer = document.querySelector("#game-container");
    const clickContainer = document.querySelector("#click-container");
    const fishingLine = document.querySelector("#line");
    const startScreen = document.querySelector("#start-screen");
    const startTitle = document.querySelector("#start-title");
    const infoWrapper = document.querySelector("#info-wrapper");
    const backButton = document.querySelector("#back-button");
    const textWrapper = document.querySelector("#text-wrapper");
    const instructions = document.querySelector("#instructions");
    const startBtn = document.querySelector("#start-btn");
    const gameStats = document.querySelector("#game-stats");
    const gameGoal = document.querySelector("#game-goal");
    const gameDay = document.querySelector("#game-day");
    const gameTimer = document.querySelector("#game-timer");
    const gameTimerGauge = document.querySelector(".timer-gauge");
    const gameScore = document.querySelector("#game-score");
    var mousePosition = {
        x:0,
        y:0
    }
    var gameTimerInterval = null;
    var day = 0;
    var score = 0;
    var currentScore = 0;
    var fishTracker = [0,0,0,0]


    var createFishInterval = null;
    var createFish1Interval = null;
    var createFish2Interval = null;
    var createFish3Interval = null;
    var createFish4Interval = null;
    var createRareFishInterval = null;
    var createTrashInterval = null;
    var createBelutlistrikInterval = null;
    var createBuayaInterval = null;

    var days = [{
        "Stage": 0,
        "score": 20,
        "instruction": "Selamat datang di game edukasi ikan-ikan di Kalimantan.<br>Setiap stage berisi 5 hari permainan.<br>Ada 2 stage: rawa dan laut.<br>Sekarang kamu berada di stage rawa"
    },{
        "Stage": 1,
        "score": 30,
        "instruction": "Hari pertama di rawa, kamu terkejut menemui buaya.<br>Mereka berbahaya!"
    },{
        "Stage": 2,
        "score": 35,
        "instruction": "Sampah mulai bermunculan di rawa.<br>Buaya tidak mendekati tempat yang tercemar sampah.<br>Hindari sampah."
    },{
        "Stage": 3,
        "score": 40,
        "instruction": "Sekarang di laut, hati-hati dengan hiu.<br>Jaga agar sampah tidak mengganggu perburuan ikanmu!"
    },{
        "day": 4,
        "score": 45,
        "instruction": "Hari terakhir di laut, temukan dan bersihkan spot ikan langka dari sampah.<br>Jaga lingkungan agar ikan-ikan bisa hidup dengan baik."
    }];
    
    // var bgm; background musik
    // var blop; suara nangkap ikan
    var rareBlop; // rare fish sound
    var trashSound; // trash sound
    var bzzt; //jellyfish zapping sound
    var bite; // bite sound

    //event listeners
    startBtn.addEventListener("click", startGame);
    clickContainer.addEventListener("mousemove", checkCursor);

    function checkCursor (event){
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
        fishingLine.style.left= mousePosition.x+"px";
        fishingLine.style.top = mousePosition.y+"px";
    }
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }
    }

    function startGame () {
    
        blop = new sound('sfx/fish.mp3');
        rareBlop = new sound('sfx/rare-fish.mp3');
        trashSound = new sound('sfx/trash.mp3');
        bzzt = new sound('sfx/bzzt.mp3');
        bite = new sound('sfx/bite.mp3');
        bgm = new sound('sfx/Bug_Catching.mp3');
        bgm.play();
        if (day === 0){
            fishTracker = [0,0,0,0,0];
            score = 0;
        }
        currentScore=0;
        infoWrapper.style.display = "none";
        backButton.style.display = "none";
        textWrapper.style.display = "none";
        startTitle.style.display = "none";
        clickContainer.style.display = "block";
        gameStats.style.display = "flex";
        gameGoal.style.display = "block";
        createItems();
    }
    function createItems() {
        createTimer();
        day++;
        gameDay.innerText = "Day 0"+day;
        gameGoal.innerText = `Target: ${currentScore}/${days[day-1].score}`;
        switch (day) {
            case 1:
                createFishInterval = setInterval(createFish, 250);
                createBuayaInterval = setInterval(createBuaya,4000);  
                break;

            case 2:
                createFish2Interval = setInterval(createFish2, 250);
                createTrashInterval = setInterval(createTrash, 1000);
                break;

            case 3:
                createFish3Interval = setInterval(createFish3, 250);
                createTrashInterval = setInterval(createTrash, 1000);
                createTrashInterval = setInterval(createTrash, 1000);
                break;

            case 4:
                createFish4Interval = setInterval(createFish4, 250);
                createTrashInterval = setInterval(createTrash, 1500);
                break;

            case 5:
                createRareFishInterval = setInterval(createRareFish, 3600);
                createRareFishInterval = setInterval(createRareFish, 3600);
                createTrashInterval = setInterval(createTrash, 1500);
                createTrashInterval = setInterval(createTrash, 1500);
                createBelutlistrikInterval = setInterval(createBelutlistrik,2000);
                createBelutlistrikInterval = setInterval(createBelutlistrik,2000);
                createBuayaInterval = setInterval(createBuaya,4000);
                break;
        }
    }
    function createTimer () {
        gameTimer.innerText = "9s";
        gameScore.innerText = "Total Target: 0";
        let sec = 0;
        gameTimerInterval = setInterval(startGameTimer, 1000);
        function startGameTimer () {
            gameTimer.textContent = 9-sec+"s";
            if (sec === 9) {
                sec = 0;
                endDay(false);
                gameTimer.textContent = 9-sec+"s";
                gameTimer.classList.remove("warning");
                gameTimerGauge.classList.remove("ticking");
            }
            else {
                if (sec === 1) {
                    gameTimerGauge.classList.add("ticking");
                }
                if (sec > 9){
                    gameTimer.classList.add("warning");
                }
                sec++
            }
        }
    }
    function createFish () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("fish");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);
        }, 1000);
    }
    function createFish1 () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("fish1");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);
        }, 1000);
    }
    function createFish2 () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("fish2");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);
        }, 1000);
    }
    function createFish3 () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("fish3");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);
        }, 1000);
    }
    function createFish4 () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("fish4");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);
        }, 1000);
    }
    //create rare fish function
    function createRareFish () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("rare-fish");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);

        }, 650);
    }
    function createTrash () {
        let trash = document.createElement("div");
        trash.classList.add("item");
        trash.classList.add("trash");
        clickContainer.appendChild(trash);
        setPosition(trash);
        trash.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!trash.classList.contains("caught")){
                trash.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(trash)){
                    clickContainer.removeChild(trash);
                }
            }, 350);
        }, 3000);
    }
    function createBelutlistrik () {
        let Belut = document.createElement("div");
        Belut.classList.add("item");
        Belut.classList.add("Belut");
        clickContainer.appendChild(Belut);
        setPosition(Belut);
        Belut.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!Belut.classList.contains("caught")){
                Belut.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(Belut)){
                    clickContainer.removeChild(Belut);
                }
            }, 350);
        }, 3000);
    }
    function createBuaya () {
        let buaya = document.createElement("div");
        buaya.classList.add("item");
        buaya.classList.add("buaya");
        clickContainer.appendChild(buaya);
        setPosition(buaya);
        buaya.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!buaya.classList.contains("caught")){
                buaya.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(buaya)){
                    clickContainer.removeChild(buaya);
                }
            }, 350);
        }, 3000);
    }

    function setPosition(item) {
        let leftPos = Math.floor(Math.random() * (clickContainer.offsetWidth-100));
        let topPos = Math.floor(Math.random() * ((clickContainer.offsetHeight/5*4)-100)+(clickContainer.offsetHeight/5));
        if (!item.classList.contains("trash")) {
            let randomNum = Math.floor(Math.random()*2);
            if (randomNum%2 === 0){
                if (!item.classList.contains("Belut")){
                    leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/4)-100));
                }
                else {
                    leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/2)-100));
                }
                setInterval(function(){
                    if (item.classList.contains("fish")) {
                        leftPos+=45;
                    
                    }
                    else if (item.classList.contains("fish1")){
                        leftPos+=45;
                    }
                    else if (item.classList.contains("fish2")){
                        leftPos+=45;
                    }
                    else if (item.classList.contains("fish3")){
                        leftPos+=45;
                    }
                    else if (item.classList.contains("fish4")){
                        leftPos+=45;
                    }
                    else if (item.classList.contains("rare-fish")){
                        leftPos+=85;
                    }
                    else if (item.classList.contains("Belut")){
                        leftPos+=5;
                    }
                    else if (item.classList.contains("buaya")){
                        leftPos+=15;
                        if (topPos>mousePosition.y) {
                            topPos-=10;
                        }
                        else {
                            topPos+=10;
                        }
                    }
                    item.style.left = leftPos+"px";
                    item.style.top = topPos+"px";
                }, 100);
                item.classList.add("left");
            }
            //right side
            else {
                if (!item.classList.contains("Belut")){
                leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/4)-100)+(clickContainer.offsetWidth/4*3));
                }
                else {
                    leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/2)-100)+(clickContainer.offsetWidth/2));
                }
                setInterval(function(){
                    if (item.classList.contains("fish")) {
                       leftPos-=45;
                    }
                    else if (item.classList.contains("fish1")) {
                        leftPos-=45;
                     }
                    else if (item.classList.contains("fish2")) {
                        leftPos-=45;
                     }
                    else if (item.classList.contains("fish3")) {
                        leftPos-=45;
                     }
                    else if (item.classList.contains("fish4")) {
                        leftPos-=45;
                     }
                    else if (item.classList.contains("rare-fish")){
                       leftPos-=85;
                    }
                    else if (item.classList.contains("Belut")){
                        leftPos-=5;
                    }
                    else if (item.classList.contains("buaya")){
                        leftPos-=15;
                        if (topPos>mousePosition.y) {
                            topPos-=10;
                        }
                        else {
                            topPos+=10;
                        }
                    }
                    item.style.left = leftPos+"px";
                    item.style.top = topPos+"px";
                }, 100);
                item.classList.add("right");
            }
            item.style.left = leftPos+"px"
            item.style.top = topPos+"px";
        }
        //if it is trash
        else {
            item.style.left = leftPos+"px";
            item.style.top = topPos+"px";
        }
    }
    function hit(event) {
        if (!fishingLine.classList.contains("zapped")) {
            let type = event.target.classList;
            let hitText = document.createElement('span');
            hitText.setAttribute('class','hit-text');
            this.parentNode.insertBefore(hitText,this);
            hitText.style.left = this.style.left;
            hitText.style.top = this.style.top;
            if (!this.classList.contains("caught")){
                this.classList.add("caught");
                if (type.contains("fish")) {
                    hitText.innerText = "+2";
                    hitText.style.color = "white";
                    blop.play();
                    score+=2;
                    currentScore+=2;
                    fishTracker[0]++;
                }
                else if (type.contains("fish1")) {
                    hitText.innerText = "+2";
                    hitText.style.color = "#1A2130";
                    blop.play();
                    score+=2;
                    currentScore+=2;
                    fishTracker[0]++;
                }
                else if (type.contains("fish2")) {
                    hitText.innerText = "+2";
                    hitText.style.color = "#1A2130";
                    blop.play();
                    score+=2;
                    currentScore+=2;
                    fishTracker[0]++;
                }
                else if (type.contains("fish3")) {
                    hitText.innerText = "+2";
                    hitText.style.color = "#1A2130";
                    blop.play();
                    score+=2;
                    currentScore+=2;
                    fishTracker[0]++;
                }
                else if (type.contains("fish4")) {
                    hitText.innerText = "+2";
                    hitText.style.color = "#1A2130";
                    blop.play();
                    score+=2;
                    currentScore+=2;
                    fishTracker[0]++;
                }
                else if (type.contains("rare-fish")) {
                    hitText.innerText = "+12";
                    hitText.style.color = "#9766d3";
                    rareBlop.play();
                    score+=12;
                    currentScore+=12;
                    fishTracker[1]++;
                }
                else if (type.contains("trash")){
                    hitText.innerText = "-3";
                    hitText.style.color = "#ff5252";
                    trashSound.play();
                    score-=3;
                    currentScore-=3;
                    fishTracker[2]++;
                }
                else if (type.contains("Belut")){
                    fishingLine.classList.add("zapped");
                    clickContainer.classList.add("zapped");
                    hitText.innerText = "zap!";
                    bzzt.play();
                    hitText.style.color = "#ffff33";
                    fishTracker[2]++;
                    setTimeout(function() {
                        fishingLine.classList.remove("zapped");
                        clickContainer.classList.remove("zapped");
                    }, 2000);
                }
                else if (type.contains("buaya")){
                    bite.play();
                    endDay(true);
                    sec = 0;
                }
                setTimeout(function() {
                    clickContainer.removeChild(hitText);
                }, 1000);
                gameScore.innerText = `Total Target: ${score}`;
                gameGoal.innerText = `Target: ${currentScore}/${days[day-1].score}`;
            }
        }
    }
    function endDay(died) {
        bgm.stop();
        clearInterval(gameTimerInterval);
        clearInterval(createFishInterval);
        clearInterval(createFish1Interval);
        clearInterval(createFish2Interval);
        clearInterval(createFish3Interval);
        clearInterval(createFish4Interval);
        clearInterval(createRareFishInterval);
        clearInterval(createTrashInterval);
        clearInterval(createBelutlistrikInterval);
        clearInterval(createBuayaInterval);
        let remainingItems = document.querySelectorAll(".item");
        for (var i=0;i<remainingItems.length;i++){
            clickContainer.removeChild(remainingItems[i]);
        }
        gameStats.style.display = "none";
        clickContainer.style.display = "none";
        gameGoal.style.display = "none";
        startBtn.style.top = "66%";
        if (!died) {
            console.log (`Day${day}`);
            if (day < 5) {
                if (currentScore<=days[day-1].score){
                    instructions.innerHTML = `<h2>END OF DAY 0${day}</h2>Target anda tidak tercapai: ${currentScore}</p><p>Coba kembali!</p>`;
                    day=0;
                }
                else {
                    instructions.innerHTML = `<h2>END OF DAY 0${day}</h2>Target anda tercapai: ${currentScore}</p><p>${days[day].instruction}</p>`;
                }
            }
            else {
                instructions.innerHTML = `<h2>Kamu sudah puas dengan hasil tangkapan mu, kamu mendapatkan banyak ikan-ikan yang sangat bermanfaat dan kamu menjadi tahu nama-nama ikan baru!</h2><p>Dari hasil tangkapan, kamu mendapatkan ${fishTracker[0]} ikan-ikan, ${fishTracker[1]} ikan langka, ${fishTracker[2]} sampah dan ${fishTracker[2]} belut listrik.<br>Total Target Kamu: ${score}</p>`;
                day=0;
            }

        }
        else {
            day = 0;
            instructions.innerHTML = `<h2>Yasudah mancing ulang lagi!!</h2><p>Buaya menyerang kamu, kapal kamu berakhir dihacurkan oleh buaya.<br>Hasil mancing kamu menjadi sia-sia!</p>`;
        }
        infoWrapper.style.display = "block";
        backButton.style.display = "block";
        textWrapper.style.display = "block";
        startTitle.style.display = "block";
    }
    var bubbles = document.getElementById('bubbles');
    var randomN = function(start, end){
        return Math.random()*end+start;
    };
    var bubbleNumber = 0,
    generateBubble = function(){
        if(bubbleNumber < 20){
            var bubble = document.createElement('div');
            var size = randomN(5, 10);
            bubble.setAttribute('style','width: '+size+'px; height: '+size+'px; left:'+randomN(1, bubbles.offsetWidth-(size+4) )+'px;');
            bubbles.appendChild(bubble);
            bubbleNumber++;
        }
        else {
          clearInterval(bubbleInterval);
        }
    };
    generateBubble();
    var bubbleInterval = setInterval(generateBubble, 500);

    instructions.innerHTML = `<p>${days[day].instruction}</p>`;
};