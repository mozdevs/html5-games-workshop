---
title: Scoreboard
layout: guide_step.pug
download: /assets/platformer/steps/step12.js
---

In this step we are going to add a scoreboard that displays how many coins the main character has collected:

![Coin scoreboard](/assets/platformer/coin_scoreboard.png)

In order to do that, we need to be able to **write text** in the screen. In games, this can be done in different ways:

- By using a regular TTF font, like Times New Roman (for HTML5 games this could be a Web Font)
- By using a bitmap font, which is actually a spritesheet, and render the characters one by one like they were images.

For the scoreboard we will use a bitmap font, which are called in Phaser **retro fonts**. The font will consist only of digits, a blank space and an `x` character. Here's the spritesheet:

![Bitmap font spritesheet](/assets/platformer/bitmap_font_sheet.png)

It's important to know that in order to render a text with a bitmap font, we need both an instance of `Phaser.RetroFont` _and_ an instance of `Phaser.Image`. Why? The retro font holds the _image data_ in memory (i.e. the pixel values of a rendered text), but then we need a Phaser _entity_ that can make use of that image data, such as `Phaser.Image` (or even `Phaser.Sprite`)!


## Tasks

### Keep track of how many coins have been collected

1. We only need a property in `PlayState` to do this. We are initialising it to zero in `init`, and then increasing this counter when a coin is picked up:

    ```js
    PlayState.init = function () {
        // ...
        this.coinPickupCount = 0;
    };
    ```

    ```js
    PlayState._onHeroVsCoin = function (hero, coin) {
        // ...
        this.coinPickupCount++;
    };
    ```

### Draw a coin icon on top of everything

1. Load the image asset in `preload`:

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.image('icon:coin', 'images/coin_icon.png');
        // ...
    };
    ```

1. We will separate the creation of UI elements into a separate method. Inside it, we will create a new group to store all the UI icons, text, etc.

    ```js
    PlayState._createHud = function () {
        let coinIcon = this.game.make.image(0, 0, 'icon:coin');

        this.hud = this.game.add.group();
        this.hud.add(coinIcon);
        this.hud.position.set(10, 10);
    };
    ```

    Note how all entities inside `this.hud` will get rendered _relatively_ to it. This means that, since the hud is in position `(10, 10)`, if we draw an image at –for instance– `(5, 5)`, it will get rendered at position `(15, 15)` of the screen.

1. Since the HUD must be rendered on top of everything else, it should be created _after_ spawning all the elements in the level:

    ```js
    PlayState.create = function () {
        // ...
        this._createHud();
    }
    ```

1. Check that the coin icon is rendered at the top left of the screen:

    ![HUD with coin icon](/assets/platformer/hud_icon_only.png)

### Write the text

1. Finally we get to the most interesting part! As usual, we need to load the asset that will make up the font. Note that, even though _conceptually_ it is a spritesheet, in Phaser it needs to be loaded it with `load.image`:

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.image('font:numbers', 'images/numbers.png');
        // ...
    };
    ```

1. Now we need to instantiate `Phaser.RetroFont`, that will be able to compute how a text looks like with the bitmap font spritesheet.

    ```js
    PlayState._createHud = function () {
        const NUMBERS_STR = '0123456789X ';
        this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
            NUMBERS_STR, 6);
        // ...
    };
    ```

    Since Phaser has no idea of the contents of the spritesheet, we need to tell it when creating the retro font: the width and height of each character and which characters are being included (the orden is important!)

1. With the retro font created, we need to make use of it from a game entity. We will use a `Phaser.Image` for this:

    ```js
    PlayState._createHud = function () {
        // let coinIcon = ...
        let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
            coinIcon.height / 2, this.coinFont);
        coinScoreImg.anchor.set(0, 0.5);

        // ...
        this.hud.add(coinScoreImg);
    };
    ```

1. Last, we just need to tell the retro font which text string to render.

    ```js
    PlayState.update = function () {
        // ...
        this.coinFont.text = `x${this.coinPickupCount}`;
    };
    ```

Try it in the browser and see how the text changes with every coin collected!

![Level with coin score board](/assets/platformer/level_coin_scoreboard.png)
