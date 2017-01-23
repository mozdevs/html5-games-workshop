// =============================================================================
// Sprites
// =============================================================================

//
// Hero
//

function Hero(game, x, y) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'hero');

    // anchor
    this.anchor.set(0.5, 0.5);
    // physics properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    // animations
    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
    // starting animation
    this.animations.play('stop');
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;

    // update image flipping & animations
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 400;
    let canJump = this.body.touching.down;

    if (canJump || this.isBoosting) {
        this.body.velocity.y = -JUMP_SPEED;
        this.isBoosting = true;
    }

    return canJump;
};

Hero.prototype.stopJumpBoost = function () {
    this.isBoosting = false;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

// returns the animation name that should be playing depending on
// current circumstances
Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // jumping
    if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};

//
// Spider (enemy)
//

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5);
    // animations
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('die', [3, 4, 3, 4, 3, 4, 3, 4]);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 100;

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
    }
};


// =============================================================================
// Levels
// =============================================================================

const LEVELS = [
    {
        platforms: [
            {image: 'ground', x: 0, y: 546},
            {image: 'grass:8x1', x: 0, y: 420},
            {image: 'grass:2x1', x: 420, y: 336},
            {image: 'grass:1x1', x: 588, y: 504},
            {image: 'grass:8x1', x: 672, y: 378},
            {image: 'grass:4x1', x: 126, y: 252},
            {image: 'grass:6x1', x: 462, y: 168},
            {image: 'grass:2x1', x: 798, y: 84}
        ],
        coins: [
            {x: 189, y: 524}, {x: 231, y: 524}, {x: 273, y: 524}, {x: 315, y: 524},
            {x: 819, y: 524}, {x: 861, y: 524}, {x: 903, y: 524}, {x: 945, y: 524},
            {x: 399, y: 294}, {x: 357, y: 315}, {x: 336, y: 357},
            {x: 777, y: 357}, {x: 819, y: 357}, {x: 861, y: 357}, {x: 903, y: 357}, {x: 945, y: 357},
            {x: 189, y: 231}, {x: 231, y: 231},
            {x: 525, y: 147}, {x: 567, y: 147}, {x: 609, y: 147}, {x: 651, y: 147},
            {x: 819, y: 63}, {x: 861, y: 63},
        ],
        hero: {x: 21, y: 525},
        spiders: [{x: 420, y: 530}, {x: 800, y: 362}]
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

    this.coinPickupCount = 0;
};

PlayState.preload = function () {
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');

    this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);

    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
};

PlayState.create = function () {
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin')
    };

    // create level entities and decoration
    this.game.add.image(0, 0, 'background');
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    this._loadLevel(LEVELS[0]);

    // // key bindings
    // this.keys.up.onDown.add(function () {
    //     let didJump = this.hero.jump();
    //     if (didJump) { this.sfx.jump.play(); }
    // }, this);
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
    this.game.physics.arcade.overlap(this.hero, this.coins,
        function (hero, coin) {
            this.sfx.coin.play();
            coin.kill();
            this.coinPickupCount++;
        }, null, this);

    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);

    // handle jump
    const JUMP_HOLD = 200; // ms
    if (this.keys.up.downDuration(JUMP_HOLD)) {
        let didJump = this.hero.jump();
        if (didJump) { this.sfx.jump.play(); }
    }
    else {
        this.hero.stopJumpBoost();
    }
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

        // spawn invisible walls at each side, only detectable by enemies
        this._spawnEnemyWall(platform.x, platform.y, 'left');
        this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
    }.bind(this));

    // spawn coins
    data.coins.forEach(function (coin) {
        let sprite = this.coins.create(coin.x, coin.y, 'coin');
        sprite.anchor.set(0.5, 0.5);
        // physics (so we can detect overlap with the hero)
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
        // animations
        sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
        sprite.animations.play('rotate');
    }.bind(this));

    // spawn spiders
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }.bind(this));

    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    new Phaser.Game(960, 600, Phaser.AUTO, 'game', PlayState);
};
