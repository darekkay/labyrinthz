window.onload = function () {

    // ------------------------------------------
    // SETTINGS

    var debug = false;
    var validColors = ["a6caf0", "c06000", "0080c0", "e08000"];
    var nextLevelColors = ["804000", "ff0000"];
    var levelCount = 8;
    var levelStartingPositions = [
        {x: 16, y: 122},
        {x: 16, y: 180},
        {x: 18, y: 574},
        {x: 10, y: 179},
        {x: 44, y: 464},
        {x: 13, y: 143},
        {x: 10, y: 158},
        {x: 35, y: 65 }
    ];

    // ------------------------------------------
    // GAME STATE

    var gameStarted = false;
    var currentLevel;
    var currentColor;

    // ------------------------------------------
    // RENDERING

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'wrapper', { preload: preload, create: create, update: update, render: render});
    var copy = new Phaser.Game(800, 600, Phaser.CANVAS, 'copy', { preload: preloadCopy, create: createCopy});

    var cursor;
    var background;
    var foreground;

    function preload() {
        game.load.image('end', 'assets/end.png');
        game.load.image('cursor', 'assets/cursor.png');
        game.load.image('logo', 'assets/logo.png');
        for (var i = 1; i <= levelCount; i++) {
            game.load.image('level' + i, 'assets/level' + i + '.png');
        }
    }

    function create() {
        game.stage.backgroundColor = '#FFFFFF';

        background = game.add.group();
        background.z = 0;
        foreground = game.add.group();
        foreground.z = 1;

        cursor = new Phaser.Sprite(game, game.world.centerX, game.world.centerY, 'cursor');
        foreground.add(cursor);

        var logo = new Phaser.Sprite(game, game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);

        background.add(logo);

        game.canvas.addEventListener('mousedown', requestLock);
        game.input.addMoveCallback(move, this);
    }

    function requestLock() {

        if (!gameStarted)
            startGame();

        if (game.input.mouse.locked)
            return;

        game.input.mouse.requestPointerLock();
    }

    function render() {
        if (!debug)
            return;

        game.debug.text(currentColor, 200, 15);
        game.debug.text(cursor.x + "," + cursor.y, 200, 35);
    }

    function update() {

    }

    function preloadCopy() {
        for (var i = 1; i <= levelCount; i++) {
            copy.load.image('level' + i, 'assets/level' + i + '.png');
        }
    }

    function createCopy() {

    }

    function calcCurrentColor() {
        var offset = 1;
        var pixelColor = copy.canvas.getContext('2d').getImageData(cursor.x + offset, cursor.y + offset, 1, 1).data;
        return colorToHex(pixelColor[0]) + colorToHex(pixelColor[1]) + colorToHex(pixelColor[2]);
    }

    function colorToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function loadCurrentLevel() {
        var map = new Phaser.Sprite(game, game.world.centerX, game.world.centerY, 'level' + currentLevel);
        map.anchor.setTo(0.5, 0.5);
        background.add(map);

        var copyMap = copy.add.sprite(copy.world.centerX, copy.world.centerY, 'level' + currentLevel);
        copyMap.anchor.setTo(0.5, 0.5);
    }

    function printEndScreen() {
        var map = new Phaser.Sprite(game, game.world.centerX, game.world.centerY, 'end');
        map.anchor.setTo(0.5, 0.5);
        background.add(map);
    }

    // ------------------------------------------
    // GAME LOGIC

    function move(pointer, x, y) {

        if (!game.input.mouse.locked)
            return;

        var e = game.input.mouse.event;

        cursor.x += e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        cursor.y += e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        ensureCursorWithinBorders();

        if (!gameStarted)
            return;

        currentColor = calcCurrentColor();

        if (nextLevelColors.indexOf(currentColor) !== -1) {
            nextLevel();
        }
        else if (validColors.indexOf(currentColor) === -1) {
            restartLevel();
        }
    }

    function ensureCursorWithinBorders() {
        var borderOffset = 3;
        if (cursor.x < 0)
            cursor.x = 0;
        if (cursor.y < 0)
            cursor.y = 0;
        if (cursor.x > game.width - borderOffset)
            cursor.x = game.width - borderOffset;
        if (cursor.y > game.height - borderOffset)
            cursor.y = game.height - borderOffset;
    }

    function startGame() {
        log("game start");
        gameStarted = true;
        currentLevel = 1;
        loadCurrentLevel();
        restartLevel();
    }

    function nextLevel() {
        currentLevel++;
        log("next level: " + currentLevel);

        if (currentLevel > levelCount) {
            gameOver();
        }
        else {
            loadCurrentLevel();
            restartLevel();
        }
    }

    function restartLevel() {
        log("restart level");
        cursor.x = levelStartingPositions[currentLevel - 1].x;
        cursor.y = levelStartingPositions[currentLevel - 1].y;
    }

    function gameOver() {
        log("game over");
        gameStarted = false;
        printEndScreen();
    }

    function log(message) {
        if (debug)
            console.log(message);
    }
};