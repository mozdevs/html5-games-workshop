---
title: Creating platforms
layout: guide_step.pug
download: /assets/platformer/steps/step03.js
---

A platformer game needs… platforms, right? There are multiple techniques to handling platforms and the physics related to them. In this workshop, we will consider the platforms as **sprites**, like other characters in the game.

<small>There are more efficient and flexible ways to do this, but for a one-screen platformer, this one is performant enough and, more importantly, the _most simple way_.</small>

This is how some of the platforms look like (a 4✕1 and a 1✕1):

![4x1 grass platform](/assets/platformer/grass_4x1.png) ![1x1 grass platform](/assets/platformer/grass_1x1.png)

As with images, there is a factory method to create **sprites** (in this case, instances of `Phaser.Sprite`) and add them automatically to the game world.

But _where_ to place the platforms? We could hardcode the whole thing, but in the long run it's better to have the level data in a separate file that we can load. We have some **level data as JSON** files in the `data/` folder.

<small>Ideally, these files would be generated with a level editor tool, but you can add more levels to the game after the workshop by creating your own JSON files!</small>

If you open one of these JSON files, you can see how platform data is specified:

```js
{
    "platforms": [
        {"image": "ground", "x": 0, "y": 546},
        {"image": "grass:4x1", "x": 420, "y": 420}
    ],
    // ....
}
```

## Tasks

### Load the level data

1. Phaser considers JSON files as another type of asset with can load within the game. Let's load the level data in the `preload` method:

    ```js
    PlayState.preload = function () {
        this.game.load.json('level:1', 'data/level01.json');
        // ...
    };
    ```

1. Now modify `create`:

    ```js
    PlayState.create = function () {
        //...
        this._loadLevel(this.game.cache.getJSON('level:1'));
    };

    PlayState._loadLevel(data) {
    };
    ```

You can check this works if you add a `console.log(data)` in `PlayState._loadLevel` –and don't forget to remove it afterwards.

### Spawn platform sprites


1. Before creating the sprites, we need to load the images that the platforms will use. As usual, we do this in the `preload` method:

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.image('ground', 'images/ground.png');
        this.game.load.image('grass:8x1', 'images/grass_8x1.png');
        this.game.load.image('grass:6x1', 'images/grass_6x1.png');
        this.game.load.image('grass:4x1', 'images/grass_4x1.png');
        this.game.load.image('grass:2x1', 'images/grass_2x1.png');
        this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    };
    ```

1. Now let's spawn the platforms. The level JSON file contains a `platform` property with an `Array` of the info necessary to spawn the platforms: their position, and the image. So we just need to iterate over this `Array` and add new sprites to the game world:

    ```js
    PlayState._loadLevel = function (data) {
        // spawn all platforms
        data.platforms.forEach(this._spawnPlatform, this);
    };

    PlayState._spawnPlatform = function (platform) {
        this.game.add.sprite(platform.x, platform.y, platform.image);
    };
    ```

    <small>If you are thinking why we are splitting this into different methods, it's because `_loadLevel` will become very crowded in the following steps.</small>

Refresh your browser and you should see our platform sprites!

![Platform sprites](/assets/platformer/step02_check.png)

## Checklist

- You can see platforms rendered over the background
- Make sure you are using `game.add.sprite` to create the platforms and _not_ `game.add.image`!
