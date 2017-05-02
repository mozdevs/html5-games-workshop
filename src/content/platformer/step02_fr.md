---
title: La boucle principale
layout: guide_step.pug
download: /assets/platformer/steps/step02.js
---

Le cœur de tout jeu est composé d'une boucle. Au sein de cette boucle sont traités les évènements externes (souris ou clavier), la modification de l'état du jeu (`update`) puis le dessin (`render`).

![The game loop](/assets/platformer/game_loop.png)

Au sein de Phaser, la boucle principale est générée automatiquement via les états du jeu. Un état correspond àà un « écran » dans notre jeu. Par exemple, l'écran de chargement, le menu principal, un niveau, etc. Chaque état est divisé en différentes étapes. Les importantes étant les suivantes.

![Game state](/assets/platformer/game_state.png)

Les phases `update` (mise à jour) et `render` (affichage) sont **appelées** automatiquement à chaque frame, ainsi il ne nous est pas nécessaire de gérer le temps.

Un état dans Phaser est un `Object` JavaScript possédant des méthodes spécifiques. Nous allons voir comment précharger et afficher une image de fond.

# Tâches

## Créer un état

1. Comme prédédamment, modifier `js/index.js` pour y ajouter un état nommé `play`.

  ```javascript
  const PlayState = {};

  window.onload = function () {
      let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
      game.state.add('play', PlayState);
      game.state.start('play');
  };
  ```

## Charger et afficher une image

1. Afin de **charger une image**, nous allons utiliser la phase `preload` de notre état. Dans cette phase, toutes les _assets_ (images, sons, etc.) vont être chargés.

  Pour utiliser cette phase, il faut créer une méthode du même nom.

  ```javascript
  const PlayState = {};

  PlayState.preload = function () {
      this.game.load.image('background', 'images/background.png');
  };
  ```

  Points importants :

  1. Notre état possède une référence au jeu en cours via la propriété `game`.
  2. Au chargement d'un asset, il est possible de lui donner un nom qui est réutilisé par la suite.

2. Pour **afficher une image**, nous devons créer une instance de `Phaser.Image`. La méthode `game.add` s'occupe de créer ajouter l'image à notre univers. Ainsi, l'élément est dessiné automatiquement.

  Ajouter la phase `create` à l'état du jeu.

  ```javascript
  PlayState.create = function () {
      this.game.add.image(0, 0, 'background');
  };
  ```

  `0, 0` correspondent aux coordonnées X et Y. En informatique, contrairement aux mathématiques, l'origine se trouve en haut à gauche, l'axe X va à droite et l'axe Y vers le bas.

Votre page doit afficher un superbe fond d'écran bleuté.

![A background, rendered](/assets/platformer/step01_check.png)

# Vérifications

- Un fond d'écran bleuté remplace le fond noir.

Être capable d'afficher des images est la première étape vers la construction d'un jeu vidéo. Préparez-vous pour les étapes suivantes!
