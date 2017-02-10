---
title: Switching levels
---

We have the win condition in place, but right now the only thing it does is restarting the current level… which is no fun! If you look into the `data` directory of the game, you will see that there are two JSON files: `level00.json` and `level01.json`.

What we are going to do is to **start the game** at level `#0`, and then switch to `#1` when `#0` is completed. Once the last level (in this case, `#1`) we should present some kind of "game completed" screen, but unfortunately that is out of the scope of this guide. What we would to instead is to **restart the whole game from the beginning**.

And remember that, even though there are only two levels already pre-made, **you can build your own** by adding more JSON files!

The way we have of switching levels is by passing to `PlayState` which level we want to use. Even though we haven't been using it, it turns out that the `init` method of game states can accept parameters! We will tell the state which level to use with that.

## Tasks

### Load the other level

1. Let's start by loading the first level JSON file in `preload`:

    ```js
    PlayState.preload = function () {
        this.game.load.json('level:0', 'data/level00.json');
        // ...
    };
    ```

1. We need to add a parameter to `init`. We are going to assume it will be an object with some properties. We will only use `level` now, but you could add other configuration in here.

    ```js
    const LEVEL_COUNT = 2;

    PlayState.init = function (data) {
        // ...
        this.level = (data.level || 0) % LEVEL_COUNT;
    };
    ```

    The `LEVEL_COUNT` constant is there to restart the game from the first level when we reach the end. If you add more levels and JSON files later, don't forget to update the value of this constant!

1. We also need to update the call to `_loadLevel`. Right now we have hardcoded the key of the JSON asset loaded, but we need to build that key taking into account which is the current level.

    ```js
    PlayState.create = function () {
        // ...
        // substitute the line below for the new one!
        // this._loadLevel(this.game.cache.getJSON('level:1'));
        this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));
        // ...
    };
    ```

1. Now we just need to tell `init` which level we want to load. We will pass a `{level: 0}` object, which will load the first level.

    Change the call to start the `PlayState` in `window.onload`:

    ```js
    window.onload = function () {
        // ...
        // change the line below for the new one!
        // game.state.start('play');
        game.state.start('play', true, false, {level: 0});
    };
    ```

    What are those booleans doing there? If you check out Phaser's documentation for `start` you will find the answer: the first one, `true`, tells Phaser that you want to keep the cache (i.e. the assets that we have already loaded); the second one, `false` tells Phaser that we do _not_ want to keep the existing world objects: it will wipe out all the current entities –sprites, texts, images, groups, etc.–. These are the default values, by the way.

1. Try it and you should see a different level loaded now!

    ![The first level](/assets/platformer/level00_thumb.png)

### Let the player advance through levels

1. If you try to complete the level, you will see how the game freezes due to a JavaScript error. This is because we are restarting the level, `init` is expecting a parameter, and we are not providing it!

    Let's fix this by modifying the `game.state.restart` calls in our code. The one triggered by the win condition is located at `_onHeroVsDoor`. Get rid of the old call and use this new one, with parameters:

    ```js
    PlayState._onHeroVsDoor = function (hero, door) {
        // ...
        // delete the previous call to restart()
        // this.game.state.restart();
        this.game.state.restart(true, false, { level: this.level + 1 });
    };
    ```

    See how we are increasing the level? And since in `init` we use a modulo operation on the level number, we achieve the effect of going back to the beginning of the game when all the levels have been completed.

1. Now let's fix the other call to restart the level, that happens when an enemy kills the main character.

    ```js
    PlayState._onHeroVsEnemy = function (hero, enemy) {
        // ...
        else {
            // ...
            // delete previous call to restart
            // this.game.state.restart();
            this.game.state.restart(true, false, {level: this.level});
        }
    };
    ```

All done! Play the game and win both levels to make sure everything works.

## Checklist

- The game starts from a new level
- Winning a level gets us to the next one
- Once all levels have been completed, the game is restarted from the first level.
- When the main character is killed, the _current_ level gets restarted.
