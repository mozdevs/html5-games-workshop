---
title: The main character sprite
layout: guide_step.pug
download: /assets/platformer/steps/step04.js
---

The hero or main character will be another **sprite** in our game. However, this sprite is more complex than the platforms, since it needs more business logics: moving around, jumping, etc.

Wouldn't be nice to have a class for these sprites with `jump`, `move`, etc. methods? We can achieve this by **extending** (also known as "inheriting from") `Phaser.Sprite`.

In JavaScript, we can extend classes following this pattern. Imagine that we have a base class `Vehicle` and we want to extend it in `Car`:

```js
function Car() {
    // call parent constructor
    Vehicle.call(this);
}

// clone Vehicle's prototype into Car
Car.prototype = Object.create(Vehicle.prototype);
// restore the constructor at Car
Car.prototype.constructor = Car;
```

We will use this pattern for extending `Phaser.Sprite`.

<small>Yes, sometimes inheritance is not the best choice and usually in JavaScript composition is more favoured. However, Phaser's architecture expects us to extend `Phaser.Sprite`, so this is what we are doing.</small>

## Tasks

### Load the hero image

1. In `preload`:

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.image('hero', 'images/hero_stopped.png');
    };
    ```

### Inherit from `Phaser.Sprite`

1. Add the following at the top of `main.js`. This follows the JavaScript inheritance pattern we have already seen. Note how we can have our own custom parameters –in this case, we are not requiring to provide the image key in the `Hero` constructor.

    ```js
    function Hero(game, x, y) {
        // call Phaser.Sprite constructor
        Phaser.Sprite.call(this, game, x, y, 'hero');
    }

    // inherit from Phaser.Sprite
    Hero.prototype = Object.create(Phaser.Sprite.prototype);
    Hero.prototype.constructor = Hero;
    ```

### Spawn the hero when loading the level.

1. As with platforms, the hero position is stored in the JSON level file. We will create a new method, `_spawnCharacters`, to spawn the hero and, later on, the enemies.

    ```js
    PlayState._loadLevel = function (data) {
        //...
        // spawn hero and enemies
        this._spawnCharacters({hero: data.hero});
    };
    ```

    ```js
    PlayState._spawnCharacters = function (data) {
        // spawn hero
        this.hero = new Hero(this.game, data.hero.x, data.hero.y);
        this.game.add.existing(this.hero);
    };
    ```

2. Check how it looks like. You should see the hero… not in a very good position:

    ![Bad-positioned hero](/assets/platformer/hero_bad_position.png)

    Why is this? Is the level data wrong? What happens is that, _usually_, we'd like sprites to be **handled by their center**. This helps in operations like rotations, flipping, etc. and it's also more intuitive. Let's fix this.

3. In Phaser, the point where we handle sprites and images is called **`anchor`**. It's a vector, and it accepts values in the `0` (left) to `1` (right) range. So the central point would be `(0.5, 0.5)`. Modify the `Hero` constructor to set up the anchor:

    ```js
    function Hero(game, x, y) {
        // ...
        this.anchor.set(0.5, 0.5);
    }
    ```

Refresh the browser again and you should see the hero positioned just over the ground:

![Hero positioned correctly in the scenario](/assets/platformer/step03_check.png)

## Checklist

- There is a hero sprite over the ground, on the bottom left part of the level.
