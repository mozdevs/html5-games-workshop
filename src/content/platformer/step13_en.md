---
title: Animations for the main character
---

Right now we have a few animated sprites in the game: the coins and the enemy spiders. But none for the main character! We are going to implement them now.

This is the character's spritesheet and the animations in it:

![Main character spritesheet](/assets/platformer/hero_spritesheet.png)

- Stopped: frame #0
- Running: frames #1 - #2
- Jumping (upwards): frame #3
- Falling: frame #4

<small>There's also a dying/hit animation in the spritesheet, but we will implement it in a later stage.</small>

As you can see, this can be a bit complex, so the approach that we will follow to handle animations for the main character is to **check every frame** which animation should be active and, if it's different, we'll play another one.

## Tasks

### Add the new animations

1. Previously we had `hero_stopped.png` assigned to the `hero` key, loaded as an image. We need to get rid of that, so **delete this line** in the `preload()`:

    ```js
    PlayState.preload = function () {
        // delete this line below
        this.game.load.image('hero', 'images/hero_stopped.png');
    };
    ```

1. Now we need to load the new spritesheet into the `hero` key:

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
        // ...
    };
    ```

1. Add the new animations in the `Hero` constructor:

    ```js
    function Hero(game, x, y) {
        // ...
        this.animations.add('stop', [0]);
        this.animations.add('run', [1, 2], 8, true); // 8fps looped
        this.animations.add('jump', [3]);
        this.animations.add('fall', [4]);
    }
    ```

### Calculate which animation should be playing

1. This is the new `Hero` method that will return the _name_ of the animation that should be playing:

    ```js
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
    ```

    Note how in the _falling_ state we are both checking that the vertical velocity is positive (it goes downwards) _and_ that the main character is not touching a platform. Why? Because when the character is on the ground it still has a vertical velocity caused by **the gravity**. The character doesn't fall because there is a body blocking them, not because their vertical velocity is zero.

1. We will create an `update` method for `Hero` in which we will check which animation should be playing and switch to a new one if necessary. Remember that `update` methods in `Phaser.Sprite` instances get called automatically each frame!

    ```js
    Hero.prototype.update = function () {
        // update sprite animation, if it needs changing
        let animationName = this._getAnimationName();
        if (this.animations.name !== animationName) {
            this.animations.play(animationName);
        }
    };
    ```

1. Try it now in the browser! Run, jump around… You should be able to see all the animations in place. _And_ a little glitch: the character **does not face** the right direction when moving left.

    ![Animations… with a glitch!](/assets/platformer/hero_animation_glitch.gif)

### Make the character face the right direction

1. It may sound weird, but usually in game development **flipping** (or mirroring) an image is achieved by applying a **negative scale** to the image. So applying a scale of `-100%` horizontally will flip the image of the character to face to the left.

    Add this to the `move()` method, since we know the direction in that moment:

    ```js
    Hero.prototype.move = function (direction) {
        // ...
        if (this.body.velocity.x < 0) {
            this.scale.x = -1;
        }
        else if (this.body.velocity.x > 0) {
            this.scale.x = 1;
        }
    };
    ```

    <small>In Phaser scales are normalized, so `0.5` means `50%`, `1` means `100%` and so on.</small>

The final result is the main character facing the right direction when moving.

![Main character, properly animated](/assets/platformer/hero_animations.gif)

## Checklist

- The main character shows different animations or images for the following actions: not moving, running, jumping and falling.
- The main character faces the correct direction when moving either left or right.
