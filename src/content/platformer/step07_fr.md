---
title: Gravitation
layout: guide_step_fr.pug
download: /assets/platformer/steps/step07.js
---

L'utilisation d'un moteur facilite la gestion des sauts et de la gravité. À présent, nous allons ajouter la force gravitationnelle au monde. Ainsi, le héros pourra marcher sur les plateformes. Un effet secondaire de ceci est que le héros ne pourra également plus passer à travers les murs.

Nous pouvons définir la gravitation pour toutes les entités du monde. Dans un jeu de plateforme, on désire que les caractères tels que le héros et les ennemis soient affectée par elle. Cependant, les autres éléments comme les murs ou pièces devraient rester immobiles et non soumise à la gravitation.

Un élément important que nous introduisons ici est de regrouper les sprites d'un même type ensemble. Dans Phaser, il faut créer une instance de `Phaser.Group`. À partir de là, nous pouvons gérer les collisions entre éléments individuels, ainsi que vis-à-vis de groupes.

# Tâches

## Activer la gravitation globale

1. Modifier la méthode de chargement du niveau `loadLevel` pour activer la gravitation.

    ```javascript
    const PlayState = {
        GRAVITY: 1200
    }

    PlayState.loadLevel = function (data) {
        // ...
        this.game.physics.arcade.gravity.y = this.GRAVITY;
    };
    ```

<small>Faire ceci dans le chargement du niveau permettrait d'avoir de modifier la gravité en fonction de l'univers en cours. Pourquoi ne pas avoir un niveau se déroulant sur la Lune?</small>

2. Vérifiez dans le navigateur. Le héros est sensé tomber et les autres éléments ne bougent pas, car il ne possède pas encore de corps physique.

    ![Main character falling down](/assets/platformer/hero_fall_bottom.png)

## Permettre au héros d'entrer en collision avec les plateformes

1. Notre héros de devrait pas, tel un fantôme, passer à travers les murs. Pour nous simplifier la tâche, nous allons placer les plateformes dans un groupe.

    ```javascript
    PlayState.loadLevel = function (data) {
        this.platforms = this.game.add.group();

        // ...
    };
    ```

2. À présent, la création d'une plateform, d'un `Phaser.Sprite`, va se faire au travers du groupe. Et comme pour le héros, il est indispensable d'activer la physique.

    ```javascript
    PlayState.spawnPlatform = function (platform) {
        let sprite = this.platforms.create(
            platform.x, platform.y, platform.image);

        this.game.physics.enable(sprite);
    };
    ```

3. Le héros et les plateformes n'entrent pas en collision encore. Il faut explicitement générer la collision à chaque mise à jour `update` de l'état du jeu.

    ```js
    PlayState.update = function () {
        this.handleCollisions();
        this.handleInput();
    };

    PlayState.handleCollisions = function () {
        this.game.physics.arcade.collide(this.hero, this.platforms);
    };
    ```

4. Si on essaie, les plateformes tombent et une persiste en restant sur la tête du héros. Le héros reste car nous l'avons empêcher de sortir de l'écran.

    ![Platforms falling](/assets/platformer/platforms_falling.gif)

## Corriger la gravitation des éléments fixes

1. Si les collisions sont importantes pour les plateformes, la gravitation ne l'est pas. Désactivons-la.

    ```js
    PlayState.spawnPlatform = function (platform) {
        // ...
        sprite.body.allowGravity = false;
    };
    ```

2. On rafraichit le jeu et les plateformes restent en place... sauf le sol. Ceci se produit car le poids du héros va être appliqué sur le sol et le faire tomber.

3. Pour corriger ce dernier point, nous devons rendre notre plateformes immuables en cas de collision.

    ```js
    PlayState._spawnPlatform = function (platform) {
        // ...
        sprite.body.immovable = true;
    };
    ```

Tout devrait fonctionner à merveilles à présent. En bonus, le héros n'est plus capable de traverser les murs et va rester bloqué au milieu par le petit bloc.

![Character vs Wall](/assets/platformer/step06_check.png)

# Vérifications

- Les plateformes restent en place
- Le héros ne tombent pas à travers du sol
- Le héros ne peut pas traverser le petit mur posé sur le sol

À présent, il est temps de sauter!
