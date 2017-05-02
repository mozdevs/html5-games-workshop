---
title: Contrôles au clavier
layout: guide_step_fr.pug
download: /assets/platformer/steps/step05.js
---

La joueuse ou le joueur contrôlera le personnage principal à l'aide du claivier. Pour commencer, il se déplacera à gauche ou à droite en utilisant les flèches du clavier.

Phaser gère l'état des touches avec des instances de la classe `Phaser.Key`. Chaque instance est lié à une touche spécifique. Comme tout le clavier ne nous intéresse, nous allors écouter uniquement les touches flèche gauche et droite.

# Tâches

## Créer les instances de `Phaser.Key`

1. La création des `Phaser.Key` se fait via [`game.input.keyboard.addKeys`](http://phaser.io/docs/2.6.2/Phaser.Keyboard.html#addKeys) qui permet d'instancier plusieurs touches à la fois. Nous utilisons la phase `init` car il n'est pas nécessaire d'avoir les assets chargés avec `preload`.

    ```javascript
    PlayState.init = function () {
        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT
        });
    };
    ```

## Ajouter le mouvement `move` au héros

1. Ici, nous allons pouvoir bénéficier du fait d'avoir spécialisé le `Phaser.Sprite` pour le héros. Ajoutez la la méthode déplacer `move` qui recevra en argument `-1` pour gauche et `1` pour droite.

    ```javascript
    Hero.prototype = Object.create(Phaser.Sprite.prototype);
    Hero.prototype.constructor = Hero;

    Hero.prototype.move = function (direction) {
        this.x += direction * 2.5; // 2.5 pixels each frame
    };
    ```

## Lier les touches et le déplacement

1. Rappelez-vous comment `update` et `render` opère dans la boucle principale.

  ```javascript
  PlayState.update = function () {
      this.handleInput();
  };
  ```

  ```javascript
  PlayState.handleInput = function () {
      if (this.keys.left.isDown) {
          this.hero.move(-1);
      }
      if (this.keys.right.isDown) {
          this.hero.move(1);
      }
  };
  ```

## Problème d'_antialiasing_

1. Avec un œil de lynx, on peut distinguer que le héros et tantôt un peu flouté lorsqu'il se déplace.

  ![Blurry hero sprite](/assets/platformer/blurry_hero.png)

  Ceci est dû à l'_anti-aliasing_, une technique utilisée pour dessiner des images dans un système de coordonnées flottant (comme `100.27` au lieu de `100`). Pour la plupart des jeux, ce résultat est désiré pour un rendu plus lisse. Mais dans un jeu utilisant le style _pixel art_, c'est n'est pas ok d'avoir des flous, même légèrement.

  Heureusement pour nous, il existe un moyen de forcer Phaser à arrondir le dessin des images.

  Ceci peut se faire dans la phase d'initialisation `init` étant donné qu'elle est exécutée avant les autres.

  ```javascript
  PlayState.init = function () {
      this.game.renderer.renderSession.roundPixels = true;
      // ...
  };
  ```

# Vérifications

- Le héros se déplace à gauche ou droite avec les flèches du clavier;
- Le dessin reste précis même après déplacement du héros. Vous pouvez vérifiez en zoomant dans le navigateur (`Ctrl`-`+` pour Windows/Linux, ou `⌘`- `+` sous macOS)

