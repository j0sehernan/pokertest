QUnit.test('Function getLevelCard', function (assert) {
    let card = new Card('T', 'D');
    assert.ok(getLevelCard(card).level === 9, 'Passed!');
});

QUnit.test('Function play', function (assert) {
    let customResponse = play(pokerGame);
    assert.ok(customResponse.response === 'player1', 'Passed!');
});