---
title: Tableau des scores
layout: guide_step_fr.pug
download: /assets/platformer/steps/step12.js
---

Dans cette étape, nous allons afficher un tableau des score, nommé _Head-up display_ (HUD) en anglais, affichant la quantité de pièces collectées.

![Coin scoreboard](/assets/platformer/coin_scoreboard.png)

Nous devons être capable d'écrire du texte à l'écran. Dans un jeu, différentes techniques sont enviseagables.

- Utiliser une police de caractères de type TTF comme Times New Roman.
- Utiliser une police de caractères bitmap, qui est en fait une feuille de sprites.

Nous allons utiliser une police bitmap que Phaser nomme **retro fonts**. La police de caractères consiste des chiffres, d'un espace et d'un ×. La voici.

![Bitmap font spritesheet](/assets/platformer/bitmap_font_sheet.png)

Il est important de savoir que pour écrire avec une police bitmap, il faut deux instances: `Phaser.RetroFont` ainsi que `Phaser.Image`. La raison est que la police stocke les pixels de données de la fonte alors que l'image est  utilisée pour l'affichage.

# Tâches

## Mémoriser les pièces collectées

1. Il est simplement nécessaire d'ajouter une propriété à l'état du jeu. On l'initialise à zéro et augmentant à la collision entre le héros et une pièce.

    ```js
    PlayState.init = function () {
        // ...
        this.coinPickupCount = 0;
    };
    ```

    ```js
    PlayState.onHeroVsCoin = function (hero, coin) {
        // ...
        this.coinPickupCount++;
    };
    ```

## Afficher l'icône des pièces

1. Une nouvelle image est à charger représentant une image plus grande.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.image('icon:coin', 'images/coin_icon.png');
        // ...
    };
    ```

2. Nous allons séparer la création des éléments de l'interface du reste. Et également créer un nouveau groupe pour stocker tout ça.

    ```js
    PlayState.createHud = function () {
        var coinIcon = this.game.make.image(0, 0, 'icon:coin');

        this.hud = this.game.add.group();
        this.hud.add(coinIcon);
        this.hud.position.set(10, 10);
    };
    ```

    Notons que toutes les éléments à l'intérieur du groupe sont affichés relativement à la position de celui-ci `10, 10`.

3. Comme il doit être affiché par dessus tous les autres, il faut le créer en dernier.

    ```js
    PlayState.create = function () {
        // ...
        this.createHud();
    }
    ```

4. Vérifions que l'icône s'affiche correctement.

    ![HUD with coin icon](/assets/platformer/hud_icon_only.png)

## Écrire le score

1. Finalement, la partie intéressante. Il est temps de charger l'image de la police de caractères. Même si c'est une feuille de sprite, Phaser demande à ce qu'on charge en tant qu'image.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.image('font:numbers', 'images/numbers.png');
        // ...
    };
    ```

2. Avoir une image permet de créer correctement un `Phaser.RetroFont`.

    ```js
    PlayState.createHud = function () {
        this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
            '0123456789X ', 6);
        // ...
    };
    ```

    Il est important de renseigner Phaser sur la taille de chaque caractères, quels caractères sont présents et le nombre par ligne qui est de 6 dans le cas qui nous intéresse.

3. Une fois la police créée, il nous faut créer une entité pouvant être affichée dans le jeu. Une `Phaser.Image` fera l'affaire.

    ```js
    PlayState.createHud = function () {
        // var coinIcon = ...
        var coinScoreImg = this.game.make.image(
            coinIcon.x + coinIcon.width,
            coinIcon.height / 2,
            this.coinFont
        );
        coinScoreImg.anchor.set(0, 0.5);

        // ...
        this.hud.add(coinScoreImg);
    };
    ```

    on calcule les positions à partir de l'icône existante pour les avoir côte à côte.

4. Et finalement, l'attribut `text` de la fonte va dessiner le texte tel que voulu.

    ```js
    PlayState.update = function () {
        // ...
        this.coinFont.text = `x${this.coinPickupCount}`;
    };
    ```

Le score devrait à présent s'afficher et être mis à jour.

![Level with coin score board](/assets/platformer/level_coin_scoreboard.png)

