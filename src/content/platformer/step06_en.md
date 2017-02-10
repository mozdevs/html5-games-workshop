---
title: Moving sprites with physics
---

It's always a good idea to tie movement to _time_. Previously we just set the character to move a fixed amount _per frame_, but we are ignoring how many frames per second our game is executing!

We could handle movements manually by querying for the **delta time** (the time that has elapsed between this frame an the previous one), but Phaser offer us a more convenient way: the use of a **Physics engine**.

Physics engines are usually expensive in terms of computation, but Phaser has implemented a very fast and small engine named Arcade Physics. It is very limited in features, but it's enough to handle a platformer game like ours –and we will not get a performance hit!

We will use the physics engine to move sprite, but also –later on– to handle gravity, collision tests, etc.

The important thing to take into account is that each sprite will have a physical **body**, and if this body is moved, rotated, etc. by the physics engine, Phaser will automatically update their rendering properties (like `x` or `y`), so we don't need to keep track of it.

## Tasks

### Make the main character use the physics engine for movement

1. First we need to create a body for the character. This gets done when we "enable" physics for this sprite. Modify the `Hero` constructor:

    ```js
    function Hero(game, x, y) {
        // ...
        this.game.physics.enable(this);
    }
    ```

1. Now we just need to make the `move` method affect the body of the sprite instead of directly modifying its position. What we need is to modify the sprite's velocity so it can move left or right. Edit the `Hero.move` method so it looks like this:

    ```js
    Hero.prototype.move = function (direction) {
        const SPEED = 200;
        this.body.velocity.x = direction * SPEED;
    };
    ```

1. Try this out in the browser! Can you move left and right? Yes? Well done! But now we have a different problem… we need to be able to _stop_ the character!

### Stop the main character

1. We didn't need to do this before because we were modifying the _position_, but now we are modifying the _velocity_ –and obviously objects with a non-zero velocity, move. We can stop the character by setting its speed to zero, and we can do that just by passing `0` as the direction when no key is being pressed:

    ```js
    PlayState._handleInput = function () {
        if (this.keys.left.isDown) { // move hero left
            // ...
        }
        else if (this.keys.right.isDown) { // move hero right
            // ...
        }
        else { // stop
            this.hero.move(0);
        }
    };
    ```

### Prevent the main character to get out of the screen

1. This is a taste of what a physics engine can do for us with very little code from our part. Let's prevent the main character to move outside the bounds of the screen. In Phaser this can be done by setting a flag in the body. Edit the `Hero` constructor:

```js
function Hero(game, x, y) {
    // ...
    this.body.collideWorldBounds = true;
}
```

## Checklist

- You can still move the main character left and right with the arrow keys.
- The character stops if no key is being pressed.
- The character cannot move out of the screen.
