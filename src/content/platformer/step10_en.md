---
title: Death
---

We have enemies, but right now there's no interaction between them and the main character. Let's allow them to kill each other!

- The spiders will kill the main character simply by touching them.
- The main character will only be able to kill an enemy by jumping (or falling) over them.

As with picking up coins, we will need to merely have a **hit test** (with `overlap()`) and not resolving collisions (i.e. separating bodies, etc.).

## Tasks

### Make the spiders able to kill the main character

1. Killing or being killed is an important event, and we should provide a lot of feedback to the user. We will be playing a sound effect when this happens, so let's load the audio asset and create its corresponding sound entity:

    ```js
    PlayState.create = function () {
        this.sfx = {
            // ...
            stomp: this.game.add.audio('sfx:stomp')
        };
        // ...
    };

    PlayState.preload = function () {
        // ...
        this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    };
    ```

1. To do the killing, we need to detect when a spider is touching the main character. We can do this by calling `overlap()`:

    ```js
    PlayState._handleCollisions = function () {
        // ...
        this.game.physics.arcade.overlap(this.hero, this.spiders,
            this._onHeroVsEnemy, null, this);
    };
    ```

1. We need to implement the `_onHeroVsEnemy()` callback method. For now, we'll just make the spider to kill the hero. When that happens, we will play a sound effect and **restart the level** (by restarting the game state).

    ```js
    PlayState._onHeroVsEnemy = function (hero, enemy) {
        this.sfx.stomp.play();
        this.game.state.restart();
    };
    ```

1. Try it in the browser and make sure that the level restarts whenever the main character touches an enemy.

### Kill those enemies!

1. Let's allow the main character to kill the spiders. To detect whether it's falling or not, we can check the vertical velocity of the body. If it's positive, it means the character is falling and, thus, able to kill! Let's modify the `_onHeroVsEnemy()` callback to detect if the contact has been produced during a fall:

    ```js
    PlayState._onHeroVsEnemy = function (hero, enemy) {
        if (hero.body.velocity.y > 0) { // kill enemies when hero is falling
            enemy.kill();
            this.sfx.stomp.play();
        }
        else { // game over -> restart the game
            this.sfx.stomp.play();
            this.game.state.restart();
        }
    };
    ```

1. Try it and you should be able to kill the spiders. But it looks a bit odd, isn't it? Let's add a small bounce to the main character, like in classic platformers:

    ```js
    Hero.prototype.bounce = function () {
        const BOUNCE_SPEED = 200;
        this.body.velocity.y = -BOUNCE_SPEED;
    };

    PlayState._onHeroVsEnemy = function (hero, enemy) {
        if (hero.body.velocity.y > 0) {
            hero.bounce();
            // ...
        }
        // ...
    };
    ```

1. Try it again. Much better, isn't it?

    ![Bouncing on enemies](/assets/platformer/enemy_bounce.gif)

### Dying animation

1. Let's make killing enemies even more satisfying by adding an animation for when the spider has been hit. We will use the last two frames of the spritesheet for this.

    ```js
    function Spider(game, x, y) {
        // ...
        this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
        // ...
    }
    ```

1. Once thing we are going to need to do is to delay the actual killing, for when a sprite doesn't exist it's not visible and doesn't get updated. Let's add a new method for the spider to agonize:

    ```js
    Spider.prototype.die = function () {
        this.body.enable = false;

        this.animations.play('die').onComplete.addOnce(function () {
            this.kill();
        }, this);
    };
    ```

    Note how we are **disabling the body** to remove the sprite from physics operation. This is important so the spider stops and isn't taken into account for collisions.

1. Now change the `kill()` call on `_heroVsEnemy()` for a call to this new method:

    ```js
    PlayState._onHeroVsEnemy = function (hero, enemy) {
        // ...
        if (hero.body.velocity.y > 0) {
            // make sure you remove enemy.kill() !!!
            enemy.die();
        }
        // ...
    };
    ```
1. It should be working now!

    ![Spider dying animation](/assets/platformer/enemy_dying.gif)
