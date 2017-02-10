---
title: Start here
layout: guide_index.pug
collection_base: platformer
author_name: "@ladybenko"
author_url: "https://twitter.com/ladybenko"
---

We are going to create a classic **one-screen platformer** game! It will feature a main character, who can run and jump to platforms. There will also be enemies that this character will have to avoid –or kill! The goal of the game is to fetch the key and open the door that leads to the next level.

[![Screenshot](/assets/platformer/platformer_screenshot.png)](/platformer/)

You can [play the game here](/platformer/).

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

The graphic and audio assets of the game in this guide have been released in the public domain under a [CC0 license](https://creativecommons.org/share-your-work/public-domain/cc0/). These assets are:

- The images have been created by [Kenney](http://kenney.nl/), and are part of his [_Platformer Art: Pixel Redux_ set](http://opengameart.org/content/platformer-art-pixel-redux) (they have been scaled up, and some of them have minor edits).
- The background music track, [_Happy Adventure_](http://opengameart.org/content/happy-adventure-loop), has been created by [Rick Hoppmann](http://www.tinyworlds.org/).
- The sound effects have been randomly generated with the [Bfxr](http://www.bfxr.net/) synth.
