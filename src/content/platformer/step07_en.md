---
title: Gravity
---

Using a physics engine makes jumping and handling gravity easy. Now we will handle gravity in the world, making the character step _on_ platforms. And as a side effect, we will make the character not to go trough walls too!

We can set a global gravity that affects all the entities in the world. In a platformer game, We want the _characters_ (like the hero and some enemies) to be affected by it. Other sprites (like pickable coins, or _platforms_ themselves) should be immobile and not be affected by gravity).

One thing that we will start doing from now on is to group multiple sprites of the same kind into a **sprite list**: in Phaser they are instances of `Phaser.Group`. Once there, we can –among other things– perform collision tests between groups or between a single sprite and a whole group.

## Tasks

### Enable gravity in the world

1. Edit `PlayState._loadLevel` to enable the gravity:

    ```js
    PlayState._loadLevel = function (data) {
        // ...

        // enable gravity
        const GRAVITY = 1200;
        this.game.physics.arcade.gravity.y = GRAVITY;
    };
    ```

    <small>We are doing this here and not in `PlayState.init` to have more flexibility… in this way, in the future we could set the gravity value in the JSON file and allow each level to have their own gravity… Some platformers have levels in the Moon!</small>

1. Check the result in the browser… you will see that the main character falls down. The other sprites (the platforms) aren't affected because they don't have a physic body –yet.

    ![Main character falling down](/assets/platformer/hero_fall_bottom.png)

### Make the character collide against the platforms

1. We don't want the main character to go through platforms –it's not a ghost! First we need to store the platforms into a group. Let's create it before spawning any sprite:

    ```js
    PlayState._loadLevel = function (data) {
        // create all the groups/layers that we need
        this.platforms = this.game.add.group();

        // ...
    };    
    ```

1. Now change `_spawnPlatform` so the sprite gets added to the group and we enable physics on it, to check for collisions:

    ```js
    PlayState._spawnPlatform = function (platform) {
        let sprite = this.platforms.create(
            platform.x, platform.y, platform.image);

        this.game.physics.enable(sprite);
    };
    ```

    <small>`Phaser.Group.create` is a factory method for sprites. The new sprite will be added as a child of the group.</small>

1. Finally, perform collision checks between the main character and the platforms. Using `collide` will make the physics engine to avoid bodies going through other bodies:

    ```js
    PlayState.update = function () {
        this._handleCollisions();
        this._handleInput();
    };

    PlayState._handleCollisions = function () {
        this.game.physics.arcade.collide(this.hero, this.platforms);
    };
    ```

1. If you try it out, you will see how the platforms fall! And there is one remaining platform that stays on the top of the character –because we prevented the character to move outside of the screen, remember?

    ![Platforms falling](/assets/platformer/platforms_falling.gif)

### Fix collisions

1. Let's disable gravity for platforms. There is a flag for that in the body:

```js
PlayState._spawnPlatform = function (platform) {
    // ...
    sprite.body.allowGravity = false;
};
```

1. Refresh the game in the browser and you will be able to see how the platforms stay in their place… except the ground. This is happening because the main character is falling and _pushing_ against the ground –like a pool ball against other balls.

    ![Ground falling](/assets/platformer/ground_falling.gif)

1. In order to fix this, we need to tell the physics engine that the platforms _can't be moved_ when colliding. We do this by setting another flag:

    ```js
    PlayState._spawnPlatform = function (platform) {
        // ...
        sprite.body.immovable = true;
    };
    ```

Everything should be working as expected now! As a bonus, see how the character can't go through the small wall/platform on the ground:

![Character vs Wall](/assets/platformer/step06_check.png)

## Checklist

- Platforms stay at their place.
- The main character does not fall _through_ the ground.
- The main character can't go through the small wall on the ground.

Now on to doing some jumps!
