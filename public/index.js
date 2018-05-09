
$(function () {

    const cards = {
        1:'./static/resources/AH.png',
        2:'./static/resources/2C.png',
        3:'./static/resources/3D.png',
        4:'./static/resources/4S.png',
        5:'./static/resources/5H.png',
        6:'./static/resources/6C.png',
        7:'./static/resources/7H.png',
        8:'./static/resources/8C.png',
        9:'./static/resources/9D.png',
        10:'./static/resources/10S.png',
        11:'./static/resources/AH.png'
    };
    let playerOneName;
    let playerTwoName;
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

    $('#player1-join-btn').click(() => {
        playerOneName = $('#player1-join-input').val();
        $('#player1-name').text(playerOneName);

    });
    $('#player2-join-btn').click(() => {
        playerTwoName = $('#player2-join-input').val();
        $('#player2-name').text(playerTwoName);
    });
    $('#new-player-btn').click(addNewPlayer);

    pOneHitme.addEventListener('click', hitMe);
    pTwoHitme.addEventListener('click', hitMe);

    pOneStay.addEventListener('click', stay);
    pTwoStay.addEventListener('click', stay);

    document.querySelector('#reset').addEventListener('click', reset);

    function hitMe(e) {
        let currPlayer = $(e.target.parentNode).next().find('input').val();

        $.ajax({
           method: 'GET',
           url: `http://localhost:3000/room/MyRoom/players/${currPlayer}/draw`,
            success: function(res) {
                let myNum = res.drawn;
                flashCard(e.target.parentNode.previousElementSibling.children[0], myNum);
                if (!(e.target.parentNode.parentNode.nextElementSibling.dataset.stay === 'true' || e.target.parentNode.parentNode.previousElementSibling.dataset.stay === 'true')) {
                    nextTurn(e.path[2]);
                }
                updateScore(e.path[2], myNum);
            }
        });
    }

    function flashCard(element, value) {
        let myCardElem = $('<img />').attr("src", cards[value]);
        console.log(value);
        element.appendChild(myCardElem[0]);
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
        $('#player-two-card').html('');
        $('#player-one-card').html('');
    }

    function addNewPlayer() {
        let playerToAdd = $('#new-player-input').val();
        $.ajax({
            method: 'POST',
            url: `http://localhost:3000/room/MyRoom/players/${playerToAdd}`,
            success: updatePlayersList
        });
    }

    function updatePlayersList(res) {
        console.log(res.players[res.players.length-1]);
        let addedPlayer = res.players[res.players.length-1];
        createPlayerTile(addedPlayer.name, addedPlayer.score);
    }

    function createPlayerTile(name, score){
        let playerTile = $('<div />').html(`<h3>${name}</h3><h2>${score}</h2>`);
        playerTile.addClass('player-tile');
        $('#players-tile-wrapper').append(playerTile);
    }

});