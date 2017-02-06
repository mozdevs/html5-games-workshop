---
title: Walking enemies
---

Right now the only challenge the player needs to overcome in our game is to execute jumps properly. It's not very fun –specially since there are no pits the character can fall into–, so let's add a hazard in the form of enemies.

Meet the mighty spiders!

![Walking spider](/assets/platformer/walking_spider.gif)

This enemy has a simple behaviour: move horizontally until it finds a "border" (a wall, the bounds of the screen, or the end of the platform) and then turn into the opposite direction.

As you could see in the GIF, spiders are animated. This is its spritesheet:

![Spider spritesheet](/assets/platformer/spider_spritesheet.png)

We will use a trick so the spiders don't fall off platforms: **invisible walls**. These walls will be sprites, with a physic body, but will not be seen. The main character will also be oblivious to them. But the spiders… the spiders will collide against these walls and turn around!

Here is how these walls would look like, if they were being displayed: note that there's one at the edge of each platform.

![Invisible walls](/assets/platformer/invisible_walls.png)

## Tasks

### Create a custom sprite for the enemies

1. First we need to load the spritesheet in `preload()`:

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    };
    ```

1. Now let's code a custom class that extends `Phaser.Sprite`, as we did with the main character. In the constructor, we will enable physics for this sprite, add the walking animation and set the sprite to move right initially:

    ```js
    function Spider(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'spider');

        // anchor
        this.anchor.set(0.5);
        // animation
        this.animations.add('crawl', [0, 1, 2], 8, true);
        this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
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
    ```

### Spawn the spiders

1. The level JSON file contains the points where the spiders should be created, so we will spawn them in `_loadLevel()`, as we have done with the rest of the sprites. Add there a new **group** to store the spiders, right below where the coins group is being created. We are also passing the spiders data to the `_spawnCharacters` method.

    ```js
    PlayState._loadLevel = function (data) {
        // ...
        this.coins = this.game.add.group();
        this.spiders = this.game.add.group();
        // ...
        // spawn hero and enemies
        this._spawnCharacters({hero: data.hero, spiders: data.spiders});
    };
    ```

1. Now spawn the spiders at `_spawnCharacters`:

    ```js
    PlayState._spawnCharacters = function (data) {
        // spawn spiders
        data.spiders.forEach(function (spider) {
            let sprite = new Spider(this.game, spider.x, spider.y);
            this.spiders.add(sprite);
        }, this);
        // ...
    };
    ```

1. Try it out and you will see a small disaster…

    ![Spiders affected by gravity](/assets/platformer/spider_disaster.gif)

    This is happening because the spiders are being affected by gravity and restricted to stay within the screen bounds, but we are not resolving collisions against the world (i.e. the platforms!).

### Resolve collisions

1. The first step is to enable collision resolution between the spiders and the platforms, like we did with the main character:

    ```js
    PlayState._handleCollisions = function () {
        this.game.physics.arcade.collide(this.spiders, this.platforms);
        // ...
    };
    ```

### Add invisible "walls" so the spiders don't fall off platforms

1. Let's add those invisible walls so the poor spiders don't fall off. Let's load the image first –it will not be displayed, but it's used so the sprite knows how big the wall is:

```js
PlayState.preload = function () {
    // ...
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    // ...
};
```

1. We also need a group to store these walls, so we can do collision detection later. Create this group after the one that holds the spiders:

    ```js
    PlayState._loadLevel = function (data) {
        // ...
        this.spiders = this.game.add.group();
        this.enemyWalls = this.game.add.group();
        // ...
    };
    ```

1. Now let's create two walls per spawned platform: one at the left side, another one at the right side:

    ```js
    PlayState._spawnPlatform = function (platform) {
        // ...
        this._spawnEnemyWall(platform.x, platform.y, 'left');
        this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
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
    ```

1. We need to resolve collisions against these walls so the spiders can't go through them, right after checking for collisions against platforms…

    ```js
    PlayState._handleCollisions = function () {
        this.game.physics.arcade.collide(this.spiders, this.platforms);
        this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
        // ...
    };
    ```

1. If you reload the browser you can see how some pink walls stop the spiders from falling!

    ![Spider blocked by wall](/assets/platformer/spider_vs_wall.png)

1. We obviously don't want to show those walls to the player, so let's hide them right after creating the group. We can hide game entities by setting their `visible` property to `false`:

    ```js
    PlayState._loadLevel = function (data) {
        // ...
        this.enemyWalls = this.game.add.group();
        this.enemyWalls.visible = false;
        // ...
    };
    ```

### Make the spiders turn

1. We know that there is a flag in a sprite's body, `touching`, that we can query to see whether the sprite is touching another one. These is what we need to detect that we have colliding against a wall or a platform.

    However, we will also need to check for the `blocked` flag, since it will tell us collisions against the world bounds.

    Add an `update()` method to `Spider`. This method will be **called automatically** by Phaser every frame. Remember that we must add new methods to custom sprites _after_ having cloned their parent's prototype:

    ```js
    Spider.prototype.update = function () {
        // check against walls and reverse direction if necessary
        if (this.body.touching.right || this.body.blocked.right) {
            this.body.velocity.x = -Spider.SPEED; // turn left
        }
        else if (this.body.touching.left || this.body.blocked.left) {
            this.body.velocity.x = Spider.SPEED; // turn right
        }
    };
    ```

Done! Spiders should be turning around when they reach the end of the platform, a wall, or the border of the screen:

![Spider turning into the opposite direction](/assets/platformer/spider_turning.gif)

## Checklist

- There are three cute spiders walking around happily without falling down or going through platforms.
- Spiders turn when they reach an obstacle or the end of the platform, so they stay in motion continuously.
- The main character cannot influence the spiders movement in any way.
