---
title: Introduction
---

We are going to create a classic **one-screen platformer** game! It will feature a main character, who can run and jump to platforms. There will also be enemies that this character will have to avoid –or kill! The goal of the game is to fetch the key and open the door that leads to the next level.

![Screenshot](/assets/platformer/platformer_screenshot.png)

We will be implementing the following game development concepts:

- **Loading** assets.
- Handling **game states**.
- Rendering **images** on the screen.
- Implementing **sprites**.
- Reading the player's input via **keyboard**.
- Using a **physics engine** to move sprites and handle **collisions**.
- Writing **text** with a bitmap font.
- Playing **sound** effects and background music.

We will focus on game development concepts and the Phaser API in a way that is accessible to as many people as possible. This means that some good practises, like modules, that require of additional tools or a better understanding of JavaScript will _not_ be seen here.

That said, if _you_ are familiar with this tools/concepts and want to use them in this workshop, by all means, do it.

## Set up the project skeleton

1. Create a directory/folder for the game in your computer.
1. Download the [initial project skeleton](/assets/platformer/start.zip) and unzip its contents in the directory you just created. Make sure that the resulting structure looks like this:

    ```
    game
    ├── audio
    ├── data
    ├── images
    ├── index.html
    └── js
    ```
1. Launch a **local web server** (we have seen how to do that in the [install guide](/en/guides/install/)) and check that you can get to the `index.html` file in the browser. For instance, if you have launched your web server in the port `3000`, you should be able to see the contents of `index.html` by accessing `http://0.0.0.0:3000`.

All done? Then let's get started!
