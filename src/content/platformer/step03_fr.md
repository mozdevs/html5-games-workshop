---
title: Création des plateformes
layout: guide_step_fr.pug
download: /assets/platformer/steps/step03.js
---

Un jeu de plateforme à besoin de... plateformes, juste? Il existe plusieurs techniques pour gérer des plateformes and la physique y relative. Dans cet atelier, nous allons considérer les plateformes comme des **sprites**, comme n'importe quel autre caractère dans le jeu.

<small>Si c'est la méthode la plus simple, c'est loin d'être la plus efficace.</small>

Une plateforme de taille 4×1 et 1×1 ressembleront à ceci.

![4x1 grass platform](/assets/platformer/grass_4x1.png) ![1x1 grass platform](/assets/platformer/grass_1x1.png)

Comme pour les images, il y a une méthode pour créer des _sprites_ (dans ce cas des `Phaser.Sprite`) et les ajouter automatiquement

Comment séparer la logique du jeu, d'une carte et de notre jeu? L'idée est d'utiliser des fichiers **JSON** représentant chaque niveau. Le répertoire `data` en contient deux pour débuter.

<small>Idéalement ces fichiers sont à générer à l'aide d'un éditeur <em>ad hoc</em>, tel que Tiled.</small>

Si vous ouvrez un de ces fichiers, on peut y voir les plateformes stockées dans un tableau (`[]`).

```javascript
{
    "platforms": [
        {"image": "ground", "x": 0, "y": 546},
        {"image": "grass:4x1", "x": 420, "y": 420}
    ],
    // ....
}
```

# Tâches

## Charger les données des niveaux

1. Phaser considère les fichiers JSON comme un type d'asset, tel qu'une image. Nous devons donc précharger le fichier de manière similaire.

  ```javascript
  PlayState.preload = function () {
    // ...
    this.game.load.json('level:1', 'data/level01.json');
  };
  ```

  Comme pour l'image, on donne un nom à l'élément pour pouvoir s'en reservir par la suite.

2. À présent, pour pouvons y accéder dans l'étape `create`.

  ```javascript
  PlayState.create = function () {
    //...
    this.loadLevel(this.game.cache.getJSON('level:1'));
  };

  PlayState.loadLevel = function (data) {
    console.log(data);
  };
  ```

  `console.log()` va afficher le contenu du niveau dans la console du développeur qu'on peut afficher depuis la touche F12 du navigateur.

## Dessiner les plateformes à l'aide de _sprites_

1. Avant de créer les _sprites_, nous devons précharger toutes les images requises. Et ceci, va dans l'étape `preload`.

  ```javascript
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

2. À présent, nous pouvons compléter la méthode de chargement du niveau `loadLevel` afin de dessiner les plateformes. Le tableau de plateformes se parcourse à l'aide d'un `forEach`. Le `this` tout seul est lié à comment JavaScript fonctionne en interne.

  ```javascript
  PlayState.loadLevel = function (data) {
    data.platforms.forEach(this.spawnPlatform, this);
  };

  PlayState.spawnPlatform = function(platform) {
    this.game.add.sprite(platform.x, platform.y, platform.image);
  };
  ```

  Rafraîchir le navigateur va laisser apparaître les plateformes à l'écran.

![Des plateformes](/assets/platformer/step02_check.png)

# Vérifications

- Vous pouvez voir les plateformes dessinées sur la fond d'écran;
- Assurez-vous de bien utiliser `game.add.sprite` et non `game.add.image`.
