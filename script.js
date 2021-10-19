// Only odd numbers, so that the game is never tie...
const MAX_POINTS = 5;
const SELECTIONS = ['rock', 'paper', 'scissors'];

function makePlural(amount, word) {
    return amount === 0 || amount > 1 ? word + 's' : word;
}

function getRandomNumber(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
}

function getComputerSelection() {
    return SELECTIONS[getRandomNumber(SELECTIONS.length)];
}

function getUserSelection() {
    while (true) {
        let userSelection = prompt('Rock, paper or scissors?');

        // User pressed 'Cancel' button
        if(userSelection === null) {
            return null;
        }

        // User submited an empty response
        if (userSelection.length === 0) {
            console.warn('Empty response! Please type your selection and try again.');
            continue;
        }

        userSelection = userSelection.toLowerCase();
        // User submited an invalid response
        if (!SELECTIONS.includes(userSelection)) {
            console.warn(`${userSelection} is an invalid reponse! Please select one of the given selections and try again.`);
            continue;
        }

        return userSelection;
    }
}

function playRound(userSelection, computerSelection, gameStatus) {
    console.log(`User selected ${userSelection}!`);
    console.log(`Computer selected ${computerSelection}!`);

    if (userSelection === computerSelection) {
        console.log('Tie!');
        return;
    }

    /*
    rock beats scissors
    paper beats rock
    scissors beats paper
    */
    if (userSelection === 'rock' && computerSelection === 'scissors' ||
        userSelection === 'paper' && computerSelection === 'rock' ||
        userSelection === 'scissors' && computerSelection === 'paper') {
            console.log(`User won this round; ${userSelection} beats ${computerSelection}!`);
            ++gameStatus.userPoints;
            return;
    }
    console.log(`Computer won this round; ${computerSelection} beats ${userSelection}!`);
    ++gameStatus.computerPoints;
}

function playGame() {
    console.log(`First to ${MAX_POINTS}, wins the game!`)

    let rounds = 1;
    const gameStatus = {
        userPoints: 0,
        computerPoints: 0
    };
    while (gameStatus.userPoints < MAX_POINTS && gameStatus.computerPoints < MAX_POINTS) {
        console.log(`Starting ${rounds++}. round...`);

        const userSelection = getUserSelection();
        if (userSelection === null) {
            console.log('User cancelled the game...');
            return;
        }
        const computerSelection = getComputerSelection();
        playRound(userSelection, computerSelection, gameStatus);

        console.log('-----------------------------');
    }

    displayGameStatus(gameStatus);
}

function displayGameStatus(gameStatus) {
    console.log(
        `${gameStatus.userPoints > gameStatus.computerPoints ? 'User' : 'Computer'} has won the game!`
    );
    console.log('Game status:');
    console.log(
        `\tUser has won ${gameStatus.userPoints} ${makePlural(gameStatus.userPoints, 'point')}.`
    );
    console.log(
        `\tComputer has won ${gameStatus.computerPoints} ${makePlural(gameStatus.computerPoints, 'point')}.`
    );
}

playGame();
