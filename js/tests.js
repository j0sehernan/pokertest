QUnit.test('Function getLevelCard', function (assert) {
    let card = new Card('T', 'D');
    assert.ok(getLevelCard(card).level === 9, 'Passed!');
});

QUnit.test('Function play', function (assert) {
    let player1Hand = [];
    player1Hand.push(new Card("A", "C"));
    player1Hand.push(new Card("A", "D"));
    player1Hand.push(new Card("Q", "S"));
    player1Hand.push(new Card("Q", "D"));
    player1Hand.push(new Card("4", "C"));

    let player2Hand = [];

    player2Hand.push(new Card("A", "S"));
    player2Hand.push(new Card("K", "C"));
    player2Hand.push(new Card("6", "S"));
    player2Hand.push(new Card("3", "H"));
    player2Hand.push(new Card("2", "D"));

    let pokerGame = [];
    pokerGame.push(new PokerGame(player1Hand, player2Hand));

    console.log("XXXXpokerGame:", pokerGame);
    let customResponse = play(pokerGame[0]);
    assert.ok(customResponse.response === 'player1', 'Passed!');
});