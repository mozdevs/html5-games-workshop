---
title: Keyboard controls
---

The player will be able to control the main character with the keyboard. For now, we will make the character move left and right when the player presses the arrow keys.

Phaser let us detect a key status (and listen to events like the key being released, etc.) via instances of `Phaser.Key`, each instance being associated to a specific key. Since we don't need to listen to the _whole_ keyboard, we can settle for one instance for the left arrow key, and another one for the right arrow key.

## Tasks

### Create instances of `Phaser.Key`

1. We can easily create `Phaser.Key` instances with the [`game.input.keyboard.addKeys`](http://phaser.io/docs/2.6.2/Phaser.Keyboard.html#addKeys) method, which allow us to create multiple keys at once. We will create them in the `init` phase, since we don't need any of the assets loaded in `preload`.

    ```js
    PlayState.init = function () {
        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT
        });
    };
    ```

    <small>You can perfectly create the keys in the `create` phase, though. But sometimes reserving `create` to spawn game entities that _need_ the assets in `preload` can help to make the code more readable.</small>

### Add a `move` method to `Hero`

1. This is when having a custom class comes handy! Let's add a `move` method which will receive the direction as a parameter: `-1` will mean left, and `1` will mean right:

    ```js
    // add this method –and the ongoing Hero methods– AFTER these lines, or you
    // will override them when cloning the Phaser.Sprite prototype
    //
    // Hero.prototype = Object.create(Phaser.Sprite.prototype);
    // Hero.prototype.constructor = Hero;

    Hero.prototype.move = function (direction) {
        this.x += direction * 2.5; // 2.5 pixels each frame
    };
    ```

### Call `Hero.move` when keys are being pressed

1. Remember how `update` and `render` were special phases of a state that were called automatically? Well, we will need to use `update` for this one: we want to check the status of the left and right arrow keys and, if they are pressed, move the character.

    ```js
    PlayState.update = function () {
        this._handleInput();
    };

    PlayState._handleInput = function () {
        if (this.keys.left.isDown) { // move hero left
            this.hero.move(-1);
        }
        else if (this.keys.right.isDown) { // move hero right
            this.hero.move(1);
        }
    };
    ```

1. Load the game in the browser and make sure you can move the character left and right. Woohoo!

### Fix a tiny glitch

If your sight is sharp you may have noticed the following glitch when moving the character:

![Blurry hero sprite](/assets/platformer/blurry_hero.png)

Do you see it? The hero sprite sometimes appear blurry, specially when compared to the background and platforms.

This is due to an anti-aliasing technique performed when drawing an image in not round coordinates (for instance, `100.27` instead of `100`). For most games it is OK because it allows for smoother movements, but since this game uses pixel art, it doesn't look nice when it's blurred, even slightly.

Fortunately for us, there is a way in Phaser to force the rendering system to round the position values when drawing images.

1. We can do this in the `init` method, since it gets executed before any other phase:

    ```js
    PlayState.init = function () {
        this.game.renderer.renderSession.roundPixels = true;
        // ...
    };
    ```

## Checklist

- The character moves left and right with the arrow keys.
- The character stays sharp after having moved. You can check this more easily if you zoom in your browser (`Ctrl` `+` for Win/Linux, or `⌘` `+` for Mac OS).
