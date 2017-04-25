---
title: Passe la monnaie
layout: guide_step_fr.pug
download: /assets/platformer/steps/step09.js
---

La mécanique de jeu principale est en place avec le saut. Il est venu temps de rendre le tout plus attrayant et ludique. Nous allons ajouter des pièces d'or pouvant être collectée par le héros. Ces pièces vont être animées et nous allons découvrir comment réaliser ces animations.

Dans Phaser, les animations sont basés sur les images clés. Ainsi un sprite va changer d'image tout les tant de temps et un animation naitra.

![Coin spritesheet](/assets/platformer/coin_spritesheet.png)

Voici la feuille de sprites de la pièce et Phaser va grandement nous simplifier la vie quand il s'agira d'en faire usage.

Pour collectionner les pièces d'or, il nous faudra détecter les collisions avec le héros.

# Tâches

## Chargement de la feuille de sprite

1. Une feuille de sprites est un type d'asset particulier à charger à l'aide de `game.load.spritesheet` and non comme une simple image. Il est important de renseigner la taille de chaque sprite individuel, ici `22×22`.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    };
    ```

## Afficher les pièces

1. Commes les plateformes, le niveau au format JSON contient l'emplacement de chaque pièce. Une fois chargée, il est important de créer un groupe, puis de générer chaque pièce.

    ```js
    PlayState._loadLevel = function (data) {
        this.platforms = this.game.add.group();
        this.coins = this.game.add.group();

        // ...

        data.coins.forEach(this.spawnCoin, this);

        // ...
    };
    ```

2. La méthode de création de pièce `spawnCoin` créer une pièce dans le groupe de pièces. Étant donné, qu'il n'y a pas de comportement particulier, une classe spécialisant `Phaser.Sprite` n'est pas nécessaire.

    ```js
    PlayState.spawnCoin = function (coin) {
        let sprite = this.coins.create(coin.x, coin.y, 'coin');
        sprite.anchor.set(0.5, 0.5);
    };
    ```

3. Il est venu le temps de tester tout ceci. Des pièces, sans animations sont présentes.

    ![Static coins](/assets/platformer/static_coins.png)

## Animer les pièces

1. Afin d'ajouter une animation, il nous faut spécifier les images désirées. De manière optionelle, on peut renseigner la vitesse d'une animation (en images par seconde) et si l'animation tourne en boucle ou pas. Un sprite peut posséder plusieurs animations qu'il convient de nommer correctement afin de les jouer à notre guise avec `play`.

    ```js
    PlayState._spawnCoin = function (coin) {
        // ...
        sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
        sprite.animations.play('rotate');
    };
    ```
2. Les pièces devraient être animées dans la scène à présent.

    ![Animated coin](/assets/platformer/animated_coin.gif)

## Collectionner les pièces

1. Le moteur physique et les collisions vont nous permettre de savoir quand une pièce est touchée. Il faut donc donner un corps physique aux pièces et désactiver la gravité pour qu'elles ne tombent pas comme des mouches.

    ```js
    PlayState.spawnCoin = function (coin) {
        // ...
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
    };
    ```

2. Ensuite, la détection des collisions. Il est important d'utiliser un test de superposition `overlap` plutôt que de collision `collide` afin que les pièces ne bloquent pas les déplacements du héros.

    ```js
    PlayState.handleCollisions = function () {
        //...
        this.game.physics.arcade.overlap(this.hero, this.coins, this.onHeroVsCoin,
            null, this);
    };
    ```

<small>Le `null` permettrait de fournir une fonction pour filter les sprites à exclure.</small>

3. Et finalement, ce qu'il se passe quand un pièce est touchée, elle disparait `kill`.

    ```js
    PlayState.onHeroVsCoin = function (hero, coin) {
        coin.kill();
    };
    ```

À ce stade, vous devriez être capable de collecter toutes les pièces du jeu.

# Vérifications

- Les pièces sont affichées avec une animation.
- Le héros peut ramasser les pièces qui disparaissent.
- Un effet sonore est joué lorsqu'une pièce disparait.
