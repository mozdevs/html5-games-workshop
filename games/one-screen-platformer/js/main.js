// =============================================================================
// Sprites
// =============================================================================

//
// Hero
//

function Hero(game, x, y) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'hero');

    this.anchor.set(0.5, 0.5);

    // physics properties
    this.game.physics.enable(this); this.body.collideWorldBounds = true;
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;

    let canJump = this.body.velocity.y === 0;
    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }
    return canJump;
};

// =============================================================================
// Levels
// =============================================================================

const LEVELS = [
    {
        platforms: [
            {image: 'ground', x: 0, y: 546}
        ],
        hero: {x: 21, y: 525}
    }
];

// =============================================================================
// Play state
// =============================================================================

PlayState = {};

PlayState.init = function () {
    // keep crispy-looking pixels
    // this.game.renderer.renderSession.roundPixels = true;

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });
};

PlayState.preload = function () {
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('hero', 'images/hero_stopped.png');

    this.game.load.audio('sfx:jump', 'audio/jump.wav');
};

PlayState.create = function () {
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump')
    };

    this.game.add.image(0, 0, 'background');

    this.platforms = this.game.add.group();
    this._loadLevel(LEVELS[0]);

    // key bindings
    this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) { this.sfx.jump.play(); }
    }, this);
};

PlayState.update = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else { // stop
        this.hero.move(0);
    }

    // handle collisions
    this.game.physics.arcade.collide(this.hero, this.platforms);
};

PlayState._loadLevel = function (data) {
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);

    // spawn platforms
    data.platforms.forEach(function (platform) {
        let sprite = this.platforms.create(
            platform.x, platform.y, platform.image);

        // physics for platform sprites
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
    }.bind(this));

    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};


// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    new Phaser.Game(960, 600, Phaser.AUTO, 'game', PlayState);
};
