# HTML5 games workshop

A workshop that teaches how to develop HTML5 games with JavaScript and [Phaser](http://phaser.io).

It is meant to last a full day, although it includes sufficient guiding for people to finish it at home if only a short session with a coach is possible.

[**Access the workshop online here**](https://mozdevs.github.io/html5-games-workshop/).

![Game screenshot](https://github.com/mozdevs/html5-games-workshop/raw/master/src/assets/assets/platformer/platformer_screenshot.png)

## Sessions

Upcoming sessions of this workshop:

- Barcelona (Spain), 4 March 2017 at [AdaJS](http://ada.barcelonajs.org/).

Would you like to host the workshop in your city? [Contact Belén](https://belenalbeza.com/speaking/#howtogetmeatyourevent).

## Development

If you want to tinker around or have your own version…

This project uses [Metalsmith](http://www.metalsmith.io/) to generate a static website out of Markdown files (among others).

### Build the project

```sh
npm install
node index.js
```

It will generate a `dist` folder with the website for the workshop generated. It's all static files.

### Watch

There is a **watch** mode that will recompile the project whenever a markdown file has been changed:

```sh
npm run watch
```

### Publish to Github Pages

```
npm run deploy
```

This assumes that your repository is named `html5-games-workshop`. If not, you will need to update `package.json` and change:

```json
"build:ghpages": "node index.js --base \"/html5-games-workshop\"",
```

…to use your repository name as `--base` parameter.
