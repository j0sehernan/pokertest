const _2 = '2';
const _3 = '3';
const _4 = '4';
const _5 = '5';
const _6 = '6';
const _7 = '7';
const _8 = '8';
const _9 = '9';
const _T = 'T';
const _J = 'J';
const _Q = 'Q';
const _K = 'K';
const _A = 'A';
const _POKER_DATA_PATH = 'data/pokerdata_2.txt';
const _ONE_SPACE = ' ';
const _INTRO = '\n';
const _EMPTY = '';
const _PLAYER_1 = 'player1';
const _PLAYER_2 = 'player2';
const _NEITHER = 'neither';
const _ROYAL_FLUSH_LEVEL = 10;
const _STRAIGHT_FLUSH_LEVEL = 9;
const _FOUR_OF_A_KIND_LEVEL = 8;
const _FULL_HOUSE_LEVEL = 7;
const _FLUSH_LEVEL = 6;
const _STRAIGHT_LEVEL = 5;
const _THREE_OF_A_KIND_LEVEL = 4;
const _TWO_PAIRS_LEVEL = 3;
const _ONE_PAIR_LEVEL = 2;
const _HIGH_CARD_LEVEL = 1;
const _100 = 100;
const _ROYAL_FLUSH_PROBABILITY = 0.000154;
const _STRAIGHT_FLUSH_PROBABILITY = 0.00139;
const _FOUR_OF_A_KIND_PROBABILITY = 0.0240;
const _FULL_HOUSE_PROBABILITY = 0.1441;
const _FLUSH_PROBABILITY = 0.1965;
const _STRAIGHT_PROBABILITY = 0.3925;
const _THREE_OF_A_KIND_PROBABILITY = 2.1128;
const _TWO_PAIRS_PROBABILITY = 4.7539;
const _ONE_PAIR_PROBABILITY = 42.2569;
const _HIGH_CARD_PROBABILITY = 50.1177;
const _TYPE_CARD_D = 'D';
const _TYPE_CARD_S = 'S';
const _TYPE_CARD_C = 'C';
const _TYPE_CARD_H = 'H';

class LevelCard {
    constructor(value, level) {
        this.value = value;
        this.level = level;
    }
}

let arrLevelCard = [];
arrLevelCard.push(new LevelCard(_2, 1));
arrLevelCard.push(new LevelCard(_3, 2));
arrLevelCard.push(new LevelCard(_4, 3));
arrLevelCard.push(new LevelCard(_5, 4));
arrLevelCard.push(new LevelCard(_6, 5));
arrLevelCard.push(new LevelCard(_7, 6));
arrLevelCard.push(new LevelCard(_8, 7));
arrLevelCard.push(new LevelCard(_9, 8));
arrLevelCard.push(new LevelCard(_T, 9));
arrLevelCard.push(new LevelCard(_J, 10));
arrLevelCard.push(new LevelCard(_Q, 11));
arrLevelCard.push(new LevelCard(_K, 12));
arrLevelCard.push(new LevelCard(_A, 13));

class Card {
    constructor(value, type) {
        this.value = value;
        this.type = type;
    }
}

class PokerGame {
    constructor(player1Hand, player2Hand) {
        this.player1Hand = player1Hand;
        this.player2Hand = player2Hand;
    }
}

class customResponse {
    constructor(response, object) {
        this.response = response;
        this.object = object;
    }
}

function getLevelCard(card) {
    return arrLevelCard.find(function (item) {
        return item.value == card.value;
    });
}

function getTypeSort(currentLevelCard, nextLevelCard) {
    if (nextLevelCard.level < currentLevelCard.level)
        return 1;
    else if (nextLevelCard.level > currentLevelCard.level)
        return -1;
    else
        return 0;
}

function sortByLevelCard(next, current) {
    let currentLevelCard = getLevelCard(current);
    let nextLevelCard = getLevelCard(next);

    return getTypeSort(currentLevelCard, nextLevelCard);
}

fetch(_POKER_DATA_PATH)
    .then(res => res.text())
    .then(data => {
        let arrPokerGames = [];
        let arrPokerGamesString = data.split(_INTRO);
        for (let pokerGameTemp of arrPokerGamesString) {

            let arrCardsString = pokerGameTemp.split(_ONE_SPACE);
            //Fill First and Second Hand
            let player1Hand = [];
            let player2Hand = [];

            arrCardsString.forEach((value, index) => {
                let arrValue = value.split(_EMPTY);
                index < 5 ? player1Hand.push(new Card(arrValue[0], arrValue[1])) : player2Hand.push(new Card(arrValue[0], arrValue[1]));
            });
            //Sort Hands
            player1Hand.sort(function (next, current) {
                return sortByLevelCard(next, current);
            });
            player2Hand.sort(function (next, current) {
                return sortByLevelCard(next, current);
            });

            arrPokerGames.push(new PokerGame(player1Hand, player2Hand));

        }

        let result = [];
        let probabilities;
        let countPlayer1Wins = 0;
        let countPlayer2Wins = 0;
        let countPlayerNeitherWins = 0;


        probabilities = '--------- PLAYER 1 --------- | --------- PLAYER 2 ---------' + _INTRO;
        console.log('--------- PLAYER 1 --------- | --------- PLAYER 2 ---------');
        //Validate the Player Win
        for (let pokerGame of arrPokerGames) {
            let response = play(pokerGame);
            let winner = response.response;

            probabilities += response.object + _INTRO;
            console.log("----winner----:", winner);
            winner === _PLAYER_1 ? countPlayer1Wins++ : winner === _PLAYER_2 ? countPlayer2Wins++ : winner === _NEITHER ? countPlayerNeitherWins++ : 0;
        }

        result.push('------------------------- ANSWERS -------------------------');
        result.push(_INTRO);
        result.push('1: ');
        result.push(countPlayer1Wins);
        result.push(_INTRO);
        result.push('2: ');
        result.push(countPlayer2Wins);
        result.push(_INTRO);
        result.push('3: ');
        result.push(countPlayerNeitherWins);
        result.push(_INTRO);
        result.push('4: ');
        result.push(_INTRO);
        result.push(probabilities);

        blobResult = new Blob(result, {
            type: 'text/plain'
        });

        exportData(blobResult, 'Answers.txt');

    });

function exportData(blobContent, fileName) {
    let reader = new FileReader();

    reader.onload = function (event) {
        let save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = fileName;

        let clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });

        save.dispatchEvent(clickEvent);

        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };

    reader.readAsDataURL(blobContent);
}

function play(pokerGame) {
    let response = new customResponse();
    let player1Hand = pokerGame.player1Hand;
    let player2Hand = pokerGame.player2Hand;
    console.log("player1Hand:", player1Hand);
    let player1HandLevel = getLevelHand(player1Hand);
    console.log("player2Hand:", player2Hand);
    let player2HandLevel = getLevelHand(player2Hand);
    console.log("_________________");
    let player1ProbabilityWins = getProbabilityHand(player1HandLevel);
    let player2ProbabilityWins = getProbabilityHand(player2HandLevel);
    console.log('       ' + player1ProbabilityWins.toFixed(6).padStart(10) + '%           |        ' + player2ProbabilityWins.toFixed(6).padStart(10) + '%          ');
    response.object = '       ' + player1ProbabilityWins.toFixed(6).padStart(10) + '%           |        ' + player2ProbabilityWins.toFixed(6).padStart(10) + '%          ';
    if (player1HandLevel > player2HandLevel) {
        response.response = _PLAYER_1;
        //return _PLAYER_1;
    } else if (player1HandLevel < player2HandLevel) {
        response.response = _PLAYER_2;
        //return _PLAYER_2;
    } else if (player1HandLevel === player2HandLevel) {
        if (player1HandLevel === _ROYAL_FLUSH_LEVEL) {
            response.response = _NEITHER;
            //return _NEITHER;
        } else if (player1HandLevel === _STRAIGHT_FLUSH_LEVEL) {
            response.response = _NEITHER;
            //return _NEITHER;
        } else if (player1HandLevel === _FOUR_OF_A_KIND_LEVEL) {
            let player1HandValue = isFourOfAKind(player1Hand).object;
            let player2HandValue = isFourOfAKind(player2Hand).object;

            if (getLevelCard(new Card(player1HandValue, _TYPE_CARD_D)).value > getLevelCard(new Card(player2HandValue, _TYPE_CARD_D)).value) {
                response.response = _PLAYER_1;
                //return _PLAYER_1;
            } else if (getLevelCard(new Card(player1HandValue, _TYPE_CARD_D)).value < getLevelCard(new Card(player2HandValue, _TYPE_CARD_D)).value) {
                response.response = _PLAYER_2;
                //return _PLAYER_2;
            } else {
                response.response = compareHighest(player1Hand, player2Hand, 0, 0);
            }
        } else if (player1HandLevel === _FULL_HOUSE_LEVEL) {
            let player1HandValue = isFullHouse(player1Hand).object;
            let player2HandValue = isFullHouse(player2Hand).object;

            if (getLevelCard(player1HandValue[0][0]).value > getLevelCard(player2HandValue[0][0]).value) {
                response.response = _PLAYER_1;
                //return _PLAYER_1;
            } else if (getLevelCard(player1HandValue[0][0]).value < getLevelCard(player2HandValue[0][0]).value) {
                response.response = _PLAYER_2;
                //return _PLAYER_2;
            } else if (getLevelCard(player1HandValue[1][0]).value > getLevelCard(player2HandValue[1][0]).value) {
                response.response = _PLAYER_1;
                //return _PLAYER_1;
            } else if (getLevelCard(player1HandValue[1][0]).value < getLevelCard(player2HandValue[1][0]).value) {
                response.response = _PLAYER_2;
                //return _PLAYER_2;
            } else {
                response.response = compareHighest(player1Hand, player2Hand, 0, 0);
            }
        } else if (player1HandLevel === _FLUSH_LEVEL) {
            response.response = compareHighest(player1Hand, player2Hand, 0, 0);
        } else if (player1HandLevel === _STRAIGHT_LEVEL) {
            response.response = compareHighest(player1Hand, player2Hand, 0, 0);
        } else if (player1HandLevel === _THREE_OF_A_KIND_LEVEL) {
            let player1HandValue = isThreeOfAKind(player1Hand).object;
            let player2HandValue = isThreeOfAKind(player2Hand).object;

            if (getLevelCard(new Card(player1HandValue, _TYPE_CARD_D)).value > getLevelCard(new Card(player2HandValue, _TYPE_CARD_D)).value) {
                response.response = _PLAYER_1;
                //return _PLAYER_1;
            } else if (getLevelCard(new Card(player1HandValue, _TYPE_CARD_D)).value < getLevelCard(new Card(player2HandValue, _TYPE_CARD_D)).value) {
                response.response = _PLAYER_2;
                //return _PLAYER_2;
            } else {
                response.response = compareHighest(player1Hand, player2Hand, 0, 0);
            }
        } else if (player1HandLevel === _TWO_PAIRS_LEVEL) {
            let player1HandValue = isTwoPairs(player1Hand).object;
            let player2HandValue = isTwoPairs(player2Hand).object;

            if (getLevelCard(player1HandValue[0][0]).value > getLevelCard(player2HandValue[0][0]).value) {
                response.response = _PLAYER_1;
                //return _PLAYER_1;
            }
            else if (getLevelCard(player1HandValue[0][0]).value < getLevelCard(player2HandValue[0][0]).value) {
                response.response = _PLAYER_2;
                //return _PLAYER_2;
            } else if (getLevelCard(player1HandValue[1][0]).value > getLevelCard(player2HandValue[1][0]).value) {
                response.response = _PLAYER_1;
                //return _PLAYER_1;
            } else if (getLevelCard(player1HandValue[1][0]).value < getLevelCard(player2HandValue[1][0]).value) {
                response.response = _PLAYER_2;
                //return _PLAYER_2;
            } else {
                response.response = compareHighest(player1Hand, player2Hand, 0, 0);
            }
        } else if (player1HandLevel === _ONE_PAIR_LEVEL) {
            let player1HandValue = isOnePair(player1Hand).object;
            let player2HandValue = isOnePair(player2Hand).object;

            if (getLevelCard(new Card(player1HandValue, _TYPE_CARD_D)).value > getLevelCard(new Card(player2HandValue, _TYPE_CARD_D)).value) {
                response.response = _PLAYER_1;
                //return _PLAYER_1;
            } else if (getLevelCard(new Card(player1HandValue, _TYPE_CARD_D)).value < getLevelCard(new Card(player2HandValue, _TYPE_CARD_D)).value) {
                response.response = _PLAYER_2;
                //return _PLAYER_2;
            } else {
                response.response = compareHighest(player1Hand, player2Hand, 0, 0);
            }
        }
        else {
            response.response = compareHighest(player1Hand, player2Hand, 0, 0);
        }
    }
    return response;
}

function findMaxIndex(arr, index) {
    let maxValue = getLevelCard(arr[index]).level;

    for (let i = index; i < arr.length; i++) {
        if (getLevelCard(arr[i]).level === maxValue)
            index = i;
    }

    return index;
}

function compareHighest(player1Hand, player2Hand, index1, index2) {
    let maxIndexPlayer1Hand = findMaxIndex(player1Hand, index1);
    let maxIndexPlayer2Hand = findMaxIndex(player2Hand, index2);

    mayorLevel1Hand = getLevelCard(player1Hand[maxIndexPlayer1Hand]).level;
    mayorLevel2Hand = getLevelCard(player2Hand[maxIndexPlayer2Hand]).level;

    if (mayorLevel1Hand > mayorLevel2Hand) {
        return _PLAYER_1;
    } else if (mayorLevel1Hand < mayorLevel2Hand) {
        return _PLAYER_2;
    } else {
        maxIndexPlayer1Hand++;
        maxIndexPlayer2Hand++

        if (maxIndexPlayer1Hand === player1Hand.length || maxIndexPlayer2Hand === player2Hand.length) {
            return _NEITHER;
        } else {
            return compareHighest(player1Hand, player2Hand, maxIndexPlayer1Hand, maxIndexPlayer2Hand)
        }
    }
}

function getProbabilityHand(playerHandLevel) {
    switch (playerHandLevel) {
        case _ROYAL_FLUSH_LEVEL:
            return Number(_100) - Number(_ROYAL_FLUSH_PROBABILITY);
        case _STRAIGHT_FLUSH_LEVEL:
            return Number(_100) - Number(_STRAIGHT_FLUSH_PROBABILITY);
        case _FOUR_OF_A_KIND_LEVEL:
            return Number(_100) - Number(_FOUR_OF_A_KIND_PROBABILITY);
        case _FULL_HOUSE_LEVEL:
            return Number(_100) - Number(_FULL_HOUSE_PROBABILITY);
        case _FLUSH_LEVEL:
            return Number(_100) - Number(_FLUSH_PROBABILITY);
        case _STRAIGHT_LEVEL:
            return Number(_100) - Number(_STRAIGHT_PROBABILITY);
        case _THREE_OF_A_KIND_LEVEL:
            return Number(_100) - Number(_THREE_OF_A_KIND_PROBABILITY);
        case _TWO_PAIRS_LEVEL:
            return Number(_100) - Number(_TWO_PAIRS_PROBABILITY);
        case _ONE_PAIR_LEVEL:
            return Number(_100) - Number(_ONE_PAIR_PROBABILITY);
        default:
            return Number(_100) - Number(_HIGH_CARD_PROBABILITY);
    }
}

function getLevelHand(playerHand) {
    if (isRoyalFlush(playerHand)) {
        console.log("_ROYAL_FLUSH_LEVEL:", _ROYAL_FLUSH_LEVEL);
        return _ROYAL_FLUSH_LEVEL;
    } else if (isStraightFlush(playerHand)) {
        console.log("_STRAIGHT_FLUSH_LEVEL:", _STRAIGHT_FLUSH_LEVEL);
        return _STRAIGHT_FLUSH_LEVEL;
    } else if (isFourOfAKind(playerHand).response) {
        console.log("_FOUR_OF_A_KIND_LEVEL:", _FOUR_OF_A_KIND_LEVEL);
        return _FOUR_OF_A_KIND_LEVEL;
    } else if (isFullHouse(playerHand).response) {
        console.log("_FULL_HOUSE_LEVEL:", _FULL_HOUSE_LEVEL);
        return _FULL_HOUSE_LEVEL;
    } else if (isFlush(playerHand)) {
        console.log("_FLUSH_LEVEL:", _FLUSH_LEVEL);
        return _FLUSH_LEVEL;
    } else if (isStraight(playerHand)) {
        console.log("_STRAIGHT_LEVEL:", _STRAIGHT_LEVEL);
        return _STRAIGHT_LEVEL;
    } else if (isThreeOfAKind(playerHand).response) {
        console.log("_THREE_OF_A_KIND_LEVEL:", _THREE_OF_A_KIND_LEVEL);
        return _THREE_OF_A_KIND_LEVEL;
    } else if (isTwoPairs(playerHand).response) {
        console.log("_TWO_PAIRS_LEVEL:", _TWO_PAIRS_LEVEL);
        return _TWO_PAIRS_LEVEL;
    } else if (isOnePair(playerHand).response) {
        console.log("_ONE_PAIR_LEVEL:", _ONE_PAIR_LEVEL);
        return _ONE_PAIR_LEVEL;
    } else {
        console.log("_HIGH_CARD_LEVEL:", _HIGH_CARD_LEVEL);
        return _HIGH_CARD_LEVEL;
    }
}

function findSameValuesInAHand(playerHand, count, arrCardsDiscard) {
    let arrSameCards = [];
    for (let i = 0; i < playerHand.length; i++) {
        let isPrevCardEvaluated = false;
        let countHints = 0;
        arrSameCards = [];

        let value = playerHand[i].value;
        //Posibilities of assert
        let arrCards = [
            new Card(value, _TYPE_CARD_D),
            new Card(value, _TYPE_CARD_S),
            new Card(value, _TYPE_CARD_C),
            new Card(value, _TYPE_CARD_H)];

        for (let card of arrCards) {
            let currentCard = findCardInHand(playerHand, card);

            if (typeof currentCard !== 'undefined') {

                if (arrCardsDiscard.length > 0) {
                    for (let item of arrCardsDiscard) {
                        if (currentCard.value === item.value) {
                            isPrevCardEvaluated = true;
                            break;
                        }
                    }
                }

                if (!isPrevCardEvaluated) {
                    countHints++;
                    arrSameCards.push(card);

                    if (countHints === count) {
                        return arrSameCards;
                    }
                }

            }
        }
    }
    return arrSameCards;
}

function isRoyalFlush(playerHand) {
    let response = false;
    let type = playerHand[0].type;
    let arrValues = [_A, _K, _Q, _J, _T];

    for (let value of arrValues) {
        let currentCard = findValueInHand(playerHand, value);

        if (typeof currentCard === 'undefined')
            return response;
        else if (currentCard.type !== type)
            return response;
    }

    response = true;

    return response;
}

function isStraightFlush(playerHand) {
    let response = false;
    let type = playerHand[0].type;
    let startValue = playerHand[0].value;

    let index = arrLevelCard.findIndex((item) => {
        return item.value === startValue;
    });

    if (index - 4 < 0)
        return response;

    let arrValues = [startValue, arrLevelCard[index - 1].value, arrLevelCard[index - 2].value, arrLevelCard[index - 3].value, arrLevelCard[index - 4].value];

    for (let value of arrValues) {
        let currentCard = findValueInHand(playerHand, value);

        if (typeof currentCard === 'undefined')
            return response;
        else if (currentCard.type !== type)
            return response;
    }

    response = true;

    return response;
}

function isFourOfAKind(playerHand) {
    let response = new customResponse(false, null);

    for (let i = 0; i < playerHand.length; i++) {
        let countHints = 0;
        let value = playerHand[i].value;

        let arrCards = [
            new Card(value, _TYPE_CARD_D),
            new Card(value, _TYPE_CARD_S),
            new Card(value, _TYPE_CARD_C),
            new Card(value, _TYPE_CARD_H)];

        for (let card of arrCards) {
            let currentCard = findCardInHand(playerHand, card);
            if (typeof currentCard !== 'undefined')
                countHints++;
        }

        if (countHints === 4) {
            response.response = true;
            response.object = value;
            return response;
        }
    }

    return response;
}

function isFullHouse(playerHand) {
    let response = new customResponse(false, null);
    let arrFirstPair = findSameValuesInAHand(playerHand, 3, []);
    if (typeof arrFirstPair !== 'undefined') {
        let arrSecondPair = findSameValuesInAHand(playerHand, 2, arrFirstPair);

        if (typeof arrSecondPair !== 'undefined') {
            if (arrFirstPair.length === 3 && arrSecondPair.length === 2) {
                response.response = true;
                response.object = [arrFirstPair, arrSecondPair];
            }
        }

    }
    return response;
}

function isFlush(playerHand) {
    let response = true;
    let type = playerHand[0].type;

    for (let card of playerHand) {
        if (card.type !== type)
            return false;
    }

    return response;
}

function isStraight(playerHand) {
    let response = false;
    let startValue = playerHand[0].value;

    let index = arrLevelCard.findIndex((item) => {
        return item.value === startValue;
    });

    if (index - 4 < 0)
        return response;

    let arrValues = [startValue, arrLevelCard[index - 1].value, arrLevelCard[index - 2].value, arrLevelCard[index - 3].value, arrLevelCard[index - 4].value];

    for (let value of arrValues) {
        let currentCard = findValueInHand(playerHand, value);

        if (typeof currentCard === 'undefined')
            return response;
    }

    response = true;

    return response;
}

function isThreeOfAKind(playerHand) {
    let response = new customResponse(false, null);

    for (let i = 0; i < playerHand.length; i++) {
        let countHints = 0;
        let value = playerHand[i].value;

        //Posibilities of assert
        let arrCards = [
            new Card(value, _TYPE_CARD_D),
            new Card(value, _TYPE_CARD_S),
            new Card(value, _TYPE_CARD_C),
            new Card(value, _TYPE_CARD_H)];

        for (let card of arrCards) {
            let currentCard = findCardInHand(playerHand, card);

            if (typeof currentCard !== 'undefined') {
                countHints++;
                if (countHints === 3) {
                    response.response = true;
                    response.object = value;
                    return response;
                }
            }

        }

        if (countHints === 3) {
            response.response = true;
            response.object = value;
            return response;
        }
    }

    return response;
}

function isTwoPairs(playerHand) {
    let response = new customResponse(false, null);
    let arrFirstPair = findSameValuesInAHand(playerHand, 2, []);
    if (typeof arrFirstPair !== 'undefined') {
        let arrSecondPair = findSameValuesInAHand(playerHand, 2, arrFirstPair);

        if (typeof arrSecondPair !== 'undefined') {
            if (arrFirstPair.length === 2 && arrSecondPair.length === 2) {
                response.response = true;
                response.object = [arrFirstPair, arrSecondPair];
            }
        }
    }

    return response;
}

function isOnePair(playerHand) {
    let response = new customResponse(false, null);

    for (let i = 0; i < playerHand.length; i++) {
        let countHints = 0;
        let value = playerHand[i].value;

        //Posibilities of assert
        let arrCards = [
            new Card(value, _TYPE_CARD_D),
            new Card(value, _TYPE_CARD_S),
            new Card(value, _TYPE_CARD_C),
            new Card(value, _TYPE_CARD_H)];

        for (let card of arrCards) {
            let currentCard = findCardInHand(playerHand, card);

            if (typeof currentCard !== 'undefined') {
                countHints++;
                if (countHints === 2) {
                    response.response = true;
                    response.object = value;
                    return response;
                }
            }

        }

        if (countHints === 2) {
            response.response = true;
            return response;
        }
    }

    return response;
}

function findCardInHand(playerHand, card) {
    return currentCard = playerHand.find(function (item) {
        return item.value === card.value && item.type === card.type;
    });
}

function findValueInHand(playerHand, value) {
    return currentCard = playerHand.find(function (item) {
        return item.value == value;
    });
}