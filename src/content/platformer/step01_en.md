---
title: Initialise Phaser
layout: guide_step.pug
download: /assets/platformer/steps/step01.js
---

## Tasks

### Set up the project skeleton

1. Create a directory/folder for the game in your computer.
1. Download the [initial project skeleton](/assets/platformer/start.zip) and unzip its contents in the directory you just created. Make sure that the resulting structure looks like this:

    ```bash
    game
    ├── audio
    ├── data
    ├── images
    ├── index.html
    └── js
    ```
1. Launch a **local web server** (we have seen how to do that in the [install guide](/en/guides/install/)) and check that you can get to the `index.html` file in the browser. For instance, if you have launched your web server in the port `3000`, you should be able to see the contents of `index.html` by accessing `http://0.0.0.0:3000`.

### Initialise Phaser and the canvas

1. HTML5 games need a `<canvas>` element to draw graphics. Phaser can create one automatically when we initialise the game. We need to supply the ID of the element that will wrap the canvas –in our case, it will be a `<div id="game">` that we have in our `index.file`. We will also be providing the canvas' dimensions (960✕600).

    To do that, open `js/main.js` in your text editor and edit the `window.onload` function to initialise Phaser:

    ```js
    window.onload = function () {
        let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    };
    ```

    You might be wondering what is this `Phaser.AUTO` parameter we are passing. It's to specify whether we want a 2D canvas or a WebGL canvas. By setting it to `AUTO`, it will try to use a WebGL canvas –for most games it's most performant– and, when it isn't available, will fallback to use a regular 2D canvas.

1. Refresh your browser so you can see the changes. You should be able to see a black canvas with the dimensions we specified in the initialisation.

    ![Empy canvas on the screen](/assets/platformer/step00_check.png)

## Checklist

Before you go ahead, make sure:

- You can access the contents of `index.html` in your browser (by launching a local server).
- You see a black canvas element on the screen.

All done? Then let's continue! The glory of game development awaits us!
