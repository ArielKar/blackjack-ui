
function onLoad() {
    let playerOneScore = 0;
    let playerTwoScore = 0;

    let pOne = document.querySelector('#player-one');
    let pTwo = document.querySelector('#player-two');

    let pOneHitme = document.querySelector('#player-one-hitme');
    let pTwoHitme = document.querySelector('#player-two-hitme');

    let pOneStay = document.querySelector('#player-one-stay');
    let pTwoStay = document.querySelector('#player-two-stay');

    let pOneScore = document.querySelector('#player-one-score');
    let pTwoScore = document.querySelector('#player-two-score');

    pOneScore.innerText = playerOneScore;
    pTwoScore.innerText = playerTwoScore;

    pOneHitme.addEventListener('click', hitMe);
    pTwoHitme.addEventListener('click', hitMe);

    pOneStay.addEventListener('click', stay);
    pTwoStay.addEventListener('click', stay);

    document.querySelector('#reset').addEventListener('click', reset);

    function hitMe(e) {
        let myNum = Math.floor((Math.random()*10)+1);
        flashCard(e.target.parentNode.previousElementSibling.children[0], myNum);
        if (!(e.target.parentNode.parentNode.nextElementSibling.dataset.stay === 'true' || e.target.parentNode.parentNode.previousElementSibling.dataset.stay === 'true')) {
            nextTurn(e.path[2]);
        }
        updateScore(e.path[2], myNum);
    }

    function flashCard(element, value) {
        element.innerText = value;
        setTimeout(() => {
           element.innerText = '';
        }, 1000);
    }

    function updateScore(player, num) {
        let id = player.id;
        if (id === 'player-one') {
            playerOneScore += num;
            pOneScore.innerText = +(pOneScore.innerText) + num;
        } else if (id === 'player-two') {
            playerTwoScore += num;
            pTwoScore.innerText = +(pTwoScore.innerText) + num;
        }
        checkScore();
    }

    function checkScore() {
        if (pOne.dataset.stay === 'true' && pTwo.dataset.stay === 'true') {
            if (playerOneScore > playerTwoScore) {
                pOne.className += ' win';
                pTwo.className += ' lose';
                disable(true);
            } else if (playerOneScore < playerTwoScore) {
                pTwo.className += ' win';
                pOne.className += ' lose';
                disable(true);
            } else {
                pOne.className += ' win';
                pTwo.className += ' win';
                disable(true);
            }
        }
        if (playerOneScore === 21) {
            pOne.className += ' win';
            pTwo.className += ' lose';
            disable(true);
        }
        if (playerTwoScore === 21) {
            pTwo.className += ' win';
            pOne.className += ' lose';
            disable(true);
        }
        if (playerOneScore > 21) {
            pOne.className += ' lose';
            pTwo.className += ' win';
            disable(true);
        }
        if (playerTwoScore > 21) {
            pOne.className += ' win';
            pTwo.className += ' lose';
            disable(true);
        }
    }

    function stay(e) {
        let player = e.target.parentNode.parentNode;
        let opponentButtons;
        player.dataset.stay = 'true';
        player.children[3].children[0].disabled = true;
        player.children[3].children[1].disabled = true;
         if (player.nextElementSibling.children[3]) {
             opponentButtons = player.nextElementSibling.children[3];
         } else {
             opponentButtons = player.previousElementSibling.children[3];
         }
        opponentButtons.children[0].disabled = false;
        opponentButtons.children[1].disabled = false;
        checkScore();
    }

    function nextTurn(currElem) {
        let opponentsHitMeBtn;
        let opponentsStayBtn;
        let currentPlayerHitBtn = currElem.children[3].children[0];
        let currentPlayerStayBtn = currElem.children[3].children[1];
        currentPlayerHitBtn.disabled = true;
        currentPlayerStayBtn.disabled = true;
        if (currElem.nextElementSibling.children[3]) {
            opponentsHitMeBtn = currElem.nextElementSibling.children[3].children[0];
            opponentsStayBtn = currElem.nextElementSibling.children[3].children[1];
        } else {
            opponentsHitMeBtn = currElem.previousElementSibling.children[3].children[0];
            opponentsStayBtn = currElem.previousElementSibling.children[3].children[1];
        }
        opponentsHitMeBtn.disabled = false;
        opponentsStayBtn.disabled = false;
    }

    function disable(state) {
        pOneHitme.disabled = state;
        pTwoHitme.disabled = state;
        pOneStay.disabled = state;
        pTwoStay.disabled = state;
    }

    function reset() {
        disable(false);
        pOne.className = 'player-container';
        pTwo.className = 'player-container';
        playerOneScore = 0;
        playerTwoScore = 0;
        pOneScore.innerText = playerOneScore;
        pTwoScore.innerText = playerTwoScore;
        pOne.dataset.stay = 'false';
        pTwo.dataset.stay = 'false';
    }
}



