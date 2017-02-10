---
title: Pickable coins
---

We have the core game mechanic –jumping– in place, so it's time to make the game more attractive and fun. We will add some coins for the main character to **pick up**. These coins will also be **animated**, so we will learn how to animate sprites.

In Phaser, animations are **keyframe-based**. This means that the sprite will change the image it's displaying periodically, and thus we will see it animated. If you have worked with CSS before, does this sound familiar?

![Coin spritesheet](/assets/platformer/coin_spritesheet.png)

This is our coin's **spritesheet**, and Phaser makes really easy to work with them and use them for animations.

<small>Yup, CSS borrowed the name for the image technique from game development!</small>

To collect the coins we will **detect when the main character has touched** any of them. The Arcade physics engine will assist us to do so, but we will another method, `overlap()`, instead of `collide()`. Why? `collide()` actually _resolves_ collisions, by separating the bodies so objects don't go through other objects: this allows for behaviours such as bouncing, pushing, blocking, etc. However we don't want the coins to _block_ the character, so we will merely perform a **hit test** and see if the character's body is overlapping a coin's body.

## Tasks

### Load the spritesheet

1. Spritesheets are a special type of asset, so we need to load them with `game.load.spritesheet` –and not with `game.load.image`. Note that we need to specify the dimensions of each individual frame (22✕22 pixels in this case):

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    };
    ```

### Spawn the coins

1. Coins data is stored in the level JSON file, so we will spawn them when we load the level. We also need a group to store all the coins, so we can detect later whether the player has touched them.

    ```js
    PlayState._loadLevel = function (data) {
        this.platforms = this.game.add.group();
        this.coins = this.game.add.group();

        // ...

        this._spawnCharacters({hero: data.hero, spiders: data.spiders});
        // spawn important objects
        data.coins.forEach(this._spawnCoin, this);

        // ...
    };
    ```

1. Onto our new `_spawnCoin` method! Coins will have no behaviour (besides a looping animation), so we don't need a custom class for it and can settle for regular `Phaser.Sprite` instances.

    ```js
    PlayState._spawnCoin = function (coin) {
        let sprite = this.coins.create(coin.x, coin.y, 'coin');
        sprite.anchor.set(0.5, 0.5);
    };
    ```

1. This is a good point to see if it's working in the browser. You should be able to see some –still static!– coins spawned through all the level.

    ![Static coins](/assets/platformer/static_coins.png)

### Add an animation!

1. Each sprite can have multiple animations, but here we only need one (the coin rotating). When adding a new animation, we specify which frame indices it will use. Optionally, we can set the animation speed (measured in frames per second) and whether the animation should loop or not. We will add and play the animation in the `_spawnCoin()` method:

    ```js
    PlayState._spawnCoin = function (coin) {
        // ...
        sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
        sprite.animations.play('rotate');
    };
    ```

1. Reload the browser and you should see the coins animated like this:

    ![Animated coin](/assets/platformer/animated_coin.gif)

### Make the character pick up coins

1. Let's _check_ for collisions between the character and the coins. Since we will use the physics engine for this, we need to give the coins a physic body (and don't forget to disable gravity or the coins will fall!).

    ```js
    PlayState._spawnCoin = function (coin) {
        // ...
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
    };
    ```

1. Now onto the detection itself! As we have said before, we will use `overlap()` and not `collide()` because we just want to query for overlaps, and not the coins to _block_ the character.

    ```js
    PlayState._handleCollisions = function () {
        //...
        this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
            null, this);
    };
    ```

    <small>If you are wondering what that `null` is for… We can add a **filter** function to exclude some of the sprites for this check. Since we want to check _all_ coins, we can just pass `null` to indicate "no filter, please".</small>

1. Let's implement now `_onHeroVSCoin()`, which is the callback that will be executed every time the main character touches a coin. What we will be doing is to get rid off the coin –this can be done by calling the `Phaser.Sprite.kill()` method.

    ```js
    PlayState._onHeroVsCoin = function (hero, coin) {
        coin.kill();
    };
    ```

### Play some audio feedback

1. Picking coin should feel _rewarding_ and playing a sound effect will help to achieve this. Let's load it in `preload()`:

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.audio('sfx:coin', 'audio/coin.wav');
    };
    ```

1. Now we just have to create a `Phaser.Sound` instance…

    ```js
    PlayState.create = function () {
        this.sfx = {
            jump: this.game.add.audio('sfx:jump'),
            coin: this.game.add.audio('sfx:coin')
        };
        // ...
    };
    ```

1. And play the sound effect in the overlap callback!

    ```js
    PlayState._onHeroVsCoin = function (hero, coin) {
        this.sfx.coin.play();
        // ...
    };
    ```

Now you should be able to move the main character and collect all the coins in the level.

## Checklist

- Coins are displayed in the level with an animation.
- The main character can pick up coins, and they disappear when it happens.
- There's a sound effect playing when picking up a coin.
