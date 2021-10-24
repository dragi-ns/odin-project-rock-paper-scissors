(function IIFE() {
    const VALID_SELECTIONS = ['rock', 'paper', 'scissors'];
    const MAX_POINTS = 5;
    const ROUND_RESULT = Object.freeze({
        DRAW: 'DRAW!',
        USER_WON: 'USER WON THIS ROUND!',
        CPU_WON: 'CPU WON THIS ROUND!',
    });

    const userInfoScore = document.querySelector('.user-info .score');
    const userInfoIcon = document.querySelector('.user-info .icon');
    const userInfoText = document.querySelector('.user-info .text');

    const cpuInfoScore = document.querySelector('.cpu-info .score');
    const cpuInfoIcon = document.querySelector('.cpu-info .icon');
    const cpuInfoText = document.querySelector('.cpu-info .text');

    const hint = document.querySelector('.hint');
    const selectionsContainer = document.querySelector('.selections');
    const selections = document.querySelectorAll('.selection');

    const playAgain = document.querySelector('.play-again');
    playAgain.addEventListener('click', resetGame);

    const gameState = {
        userPoints: 0,
        cpuPoints: 0,
        round: 1,
    };

    function animateElement(element, animationName) {
        return new Promise((resolve, reject) => {
            const nodeElement = document.querySelector(element);
            if (nodeElement === null) {
                reject(new Error(`Can't find ${element}`));
            }
            nodeElement.classList.add(animationName);
            nodeElement.addEventListener('animationend', (event) => {
                event.stopPropagation();
                nodeElement.classList.remove(animationName);
                resolve(nodeElement);
            }, { once: true });
        });
    }

    function initialGameAnimation() {
        return Promise.all([
            animateElement('.notification', 'slide-in-left'),
            animateElement('.user-info', 'slide-in-left'),
            animateElement('.cpu-info', 'slide-in-right'),
            animateElement('.versus', 'zoom-in'),
        ]);
    }

    function enableSelections() {
        return showSelections()
        .then(() => {
            selections.forEach((selection) => {
                selection.addEventListener('click', handleUserSelection);
                selection.addEventListener('keydown', handleUserSelection);
            });
            selectionsContainer.style.pointerEvents = 'auto';
        });
    }

    function disableSelections() {
        selectionsContainer.style.pointerEvents = 'none';
        selections.forEach((selection) => {
            selection.removeEventListener('click', handleUserSelection);
            selection.removeEventListener('keydown', handleUserSelection);
        });
        return hideSelections();
    }

    function handleUserSelection(event) {
        if (
            event.type === 'keydown'
            && (event.keyCode !== 13 && event.keyCode !== 32)
        ) {
            return;
        }

        const userSelection = event.target.dataset.value;
        if (!VALID_SELECTIONS.includes(userSelection)) {
            return;
        }

        disableSelections()
        .then(() => event.target.blur());

        const cpuSelection = getCpuSelection();
        displayPlayersSelections(userSelection, cpuSelection);

        const roundResult = playRound(userSelection, cpuSelection);
        displayRoundResult(roundResult)
        .then(() => {
            if (!checkForGameEnd()) {
                prepareForNextRound();
            } else {
                endGame();
            }
        });
    }

    function getCpuSelection() {
        return VALID_SELECTIONS[getRandomNumber(VALID_SELECTIONS.length)];
    }

    function getRandomNumber(maxNumber) {
        return Math.floor(Math.random() * maxNumber);
    }

    function displayPlayersSelections(userSelection, cpuSelection) {
        userInfoIcon.src = `icons/${userSelection}-100.png`;
        userInfoIcon.alt = `${userSelection} hand gesture icon`;
        userInfoText.textContent = userSelection;

        cpuInfoIcon.src = `icons/${cpuSelection}-100.png`;
        cpuInfoIcon.alt = `${cpuSelection} hand gesture icon`;
        cpuInfoText.textContent = cpuSelection;
    }

    function playRound(userSelection, cpuSelection) {
        let roundResult;
        if (userSelection === cpuSelection) {
            roundResult = ROUND_RESULT.DRAW;
        } else if (
            (userSelection === 'rock' && cpuSelection === 'scissors')
            || (userSelection === 'paper' && cpuSelection === 'rock')
            || (userSelection === 'scissors' && cpuSelection === 'paper')
        ) {
            ++gameState.userPoints;
            roundResult = ROUND_RESULT.USER_WON;
        } else {
            ++gameState.cpuPoints;
            roundResult = ROUND_RESULT.CPU_WON;
        }

        ++gameState.round;
        return roundResult;
    }

    function displayRoundResult(roundResult) {
        return animateElement('.notification', 'slide-out-right')
        .then((nodeElement) => {
            nodeElement.textContent = roundResult;
        })
        .then(() => animateElement('.notification', 'slide-in-left'))
        .then(() => updatePlayersScore());
    }

    function checkForGameEnd() {
        return gameState.userPoints >= MAX_POINTS || gameState.cpuPoints >= MAX_POINTS;
    }

    function prepareForNextRound(newGame = false) {
        return animateElement('.notification', 'slide-out-right')
        .then((nodeElement) => {
            nodeElement.textContent = `round: ${gameState.round}`;
            resetPlayersSelections(newGame);
        })
        .then(() => animateElement('.notification', 'slide-in-left'))
        .then(() => enableSelections());
    }

    function resetPlayersSelections(newGame = false) {
        if (newGame) {
            userInfoScore.textContent = 0;
            cpuInfoScore.textContent = 0;
        }

        userInfoIcon.src = `icons/placeholder.png`;
        userInfoIcon.alt = 'question mark icon';
        userInfoText.textContent = '?';

        cpuInfoIcon.src = `icons/placeholder.png`;
        userInfoIcon.alt = 'question mark icon';
        cpuInfoText.textContent = '?';
    }

    function updatePlayersScore() {
        userInfoScore.textContent = gameState.userPoints;
        cpuInfoScore.textContent = gameState.cpuPoints;
    }

    function endGame() {
        displayGameResult()
        .then(() => showPlayAgain());
    }

    function displayGameResult() {
        return animateElement('.notification', 'slide-out-right')
        .then((nodeElement) => {
            let winner;
            if (gameState.userPoints > gameState.cpuPoints) {
                winner = 'user';

                userInfoIcon.src = `icons/winner.png`;
                userInfoIcon.alt = 'winner icon';
                userInfoText.textContent = 'winner';

                cpuInfoIcon.src = `icons/loser.png`;
                userInfoIcon.alt = 'loser icon';
                cpuInfoText.textContent = 'loser';
            } else {
                winner = 'cpu';

                userInfoIcon.src = `icons/loser.png`;
                userInfoIcon.alt = 'loser icon';
                userInfoText.textContent = 'loser';

                cpuInfoIcon.src = `icons/winner.png`;
                cpuInfoIcon.alt = 'winner icon';
                cpuInfoText.textContent = 'winner';
            }
            nodeElement.textContent = `${winner} won the game!`;
        })
        .then(() => animateElement('.notification', 'slide-in-left'));
    }

    function showSelections() {
        selectionsContainer.style.display = 'flex';
        hint.style.display = 'block';
        return Promise.all([
            animateElement('.hint', 'fade-in'),
            animateElement('.selections', 'slide-in-up'),
        ]);
    }

    function hideSelections() {
        return Promise.all([
            animateElement('.hint', 'fade-out')
            .then((nodeElement) => {
                nodeElement.style.display = 'none';
            }),
            animateElement('.selections', 'slide-out-down')
            .then((nodeElement) => {
                nodeElement.style.display = 'none';
            }),
        ]);
    }

    function showPlayAgain() {
        playAgain.style.display = 'block';
        return animateElement('.play-again', 'zoom-in');
    }

    function hidePlayAgain() {
        return animateElement('.play-again', 'zoom-out')
        .then((nodeElement) => {
            nodeElement.style.display = 'none';
        });
    }

    function resetGame() {
        gameState.userPoints = 0;
        gameState.cpuPoints = 0;
        gameState.round = 1;

        prepareForNextRound(true);

        hidePlayAgain()
        .then(() => showSelections());
    }

    initialGameAnimation()
    .then(() => {
        enableSelections();
    });
}());
