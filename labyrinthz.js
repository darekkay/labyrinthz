window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'wrapper', { preload: preload, create: create, update: update, render: render});

    function preload() {
        game.load.image('logo', 'assets/logo.png');
    }

    function create() {
        game.stage.backgroundColor = '#FFFFFF';
        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }

    function render() {

    }

    function update() {

    }

};