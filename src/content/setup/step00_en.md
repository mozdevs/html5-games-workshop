---
title: Launch a local server
---

All game engines that allow for asset loading within the engine require running the game in a **local web server**. The reason is that browsers, for security reasons, block files loading from different domains.

When you simply open an HTML file from your computer in the browser, the protocol used is `file://`. This means that the site is not running on any domain/address at all, and thus Phaser is unable to dynamically load assets such as images, audio files, etc.

The solution to this is to run a local web server in our machine and serve our files from there.

Depending on your operating system and what you have already installed, there are several ways to do this.

_Note: we will assume that the game you want to run is inside the `my-game` directory._

## If you have Node

If you have Node.js in your system… congratulations! You can just install a web server and run it whenever you need it.

Execute this line in your terminal / command line to install the http-server package:

```sh
npm -g install http-server
```

And then you can just run it from any directory and it will serve its contents:

```sh
cd my-game
http-server
```

### An even better alternative…

For development you might also be interested in Browser Sync, a tool that will launch a server and **automatically reload the browser** when files are changed.

```sh
npm -g install browser-sync
```

This will launch a server and reload the browser whenever a JavaScript file is modified:

```sh
cd my-game
browser-sync start --server --files="**/*.js"
```

## If you have Mac OS or Linux (or Python in your system)

If you have Python in your system –and you _have it_ if you are running a Unix-like system, such as Mac OS X or Linux–, then you don't need to install anything else!

Run this from the terminal:

```sh
cd my-game
python -m SimpleHTTPServer
```

## I don't have Node or Python :(

OK, don't panic! Here are some alternatives:

- Some text editors and IDE's incorporate a local web server. [Brackets](http://brackets.io/) is one of those.

- Check out Phaser's _Getting Started_ guide [suggestions](  https://phaser.io/tutorials/getting-started/part2).
