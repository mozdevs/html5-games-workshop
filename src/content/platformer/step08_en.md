---
title: Jumps
layout: guide_step.pug
download: /assets/platformer/steps/step08.js
---

Once we have gravity in place, making the main character to jump is almost trivial! If you remember physics class in school, a parabolic movement needs downward gravity applied to a body (we already did that in the previous step) and then some speed applied at the initial moment upwards so the body goes up and down in a **parabola**.

We will make the main character to jump when the player presses the up arrow key. We will also play a sound effect when this happens, since **audio is crucial** –even more than graphics– to provide feedback to the user!

## Tasks

### Detect when the up key has been pressed

1. Create an instance of `Phaser.Key` tied to the up arrow key. We will do that by modifying the `addKeys` call we already had in place in `init`:

    ```js
    PlayState.init = function () {
        // ...
        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT,
            up: Phaser.KeyCode.UP // add this line
        });
    };
    ```

1. Instead checking for whether the key is pressed or not, we will listen for the "on key down" event and jump when it happens. In Phaser, events are called **signals** (they are instances of `Phaser.Signal`), and it's very easy to subscribe and unsubscribe from them.

    ```js
    this.keys.up.onDown.add(function () {
        this.hero.jump();
    }, this);
    ```

    <small>Like many other functions in JavaScript, the extra argument after the callback is what will become the `this` context when the callback is executed.

### Implement the jump method

1. Let's implement the `jump` method for `Hero`:

    ```js
    Hero.prototype.jump = function () {
        const JUMP_SPEED = 600;
        this.body.velocity.y = -JUMP_SPEED;
    };
    ```

1. Try it in the browser and check that the character can jump. You will find a bug, though: the character can jump mid-air! Although double jumps are not rare in platformer games, _infinite_ jumps sure are. We will force the character to not jump mid-air.

1. We can check if a body is touching another body. Since platforms have physic bodies, we can know whether the main character is touching another body at the bottom or not. Modify the jump method so it looks like this:

    ```js
    Hero.prototype.jump = function () {
        const JUMP_SPEED = 600;
        let canJump = this.body.touching.down;

        if (canJump) {
            this.body.velocity.y = -JUMP_SPEED;
        }

        return canJump;
    };
    ```

    <small>Note that we are also returning whether the character managed to jump or not… we will use this soon!</small>

### Play a sound effect when jumping

1. Sounds are also a game entity, but they obviously don't get rendered on the screen. But the process to handle them is similar to images. Let's start by loading the audio asset in `preload`:

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.audio('sfx:jump', 'audio/jump.wav');
    };
    ```

1. Now let's create the audio entity, which will be an instance of `Phaser.Sound`. We can create these and add them to the game world with the `game.add` factory, as usual:

    ```js
    PlayState.create = function () {
        // create sound entities
        this.sfx = {
            jump: this.game.add.audio('sfx:jump')
        };
        // ...
    };
    ```

1. Last, we need to play the sound effect when a jump has been made. Remember how we had the `Hero.jump` method to return `true` or `false` depending on whether the jump was possible? We will make use of this now! Modify the listener for the arrow key so it looks like this:

    ```js
    PlayState.init = function () {
        // ...
        this.keys.up.onDown.add(function () {
            let didJump = this.hero.jump();
            if (didJump) {
                this.sfx.jump.play();
            }
        }, this);
    };
    ```

Try it out in the browser. With a bit of skill, you should be able to jump to reach all the platforms in the level.

![Main character jumping](/assets/platformer/hero_jump.gif)


## Checklist

- The character can jump!
- The character _can not_ jump mid-air.
- A sound effect is played when jumping.
