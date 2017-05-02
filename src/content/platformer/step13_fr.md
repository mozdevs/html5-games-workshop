---
title: Animer le héros
layout: guide_step_fr.pug
download: /assets/platformer/steps/step13.js
---

Pour le moment, il y a peu de sprites animés dans le jeu : les pièces et les ennemis. Mais rien pour le héros!

Voici la feuille de sprite et les animations liées.

![Main character spritesheet](/assets/platformer/hero_spritesheet.png)

- À l'arrêt, image 0
- En course, images 1 et 2
- En Saut, image 3
- En Chute, image 4.

<small>Les images liées au décès du héros seront utilisées à l'étape suivante.</small>

L'approche utilisée pour gérer ceci est de vérifier à **chaque image** l'état du héros et choisir l'animation correspondante.

# Tâches

## Ajout des animations

1. Auparavant nous utilisions l'image `hero_stopped.png` en tant qu'image. Il nous faut supprimer cette ligne.

    ```js
    PlayState.preload = function () {
        //this.game.load.image('hero', 'images/hero_stopped.png');
    };
    ```

2. Et charger la feuille de sprites à la place. De taille `36×42`.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
        // ...
    };
    ```

3. Dans le constructeur du héros, nous pouvons ajouter les animations telles que décrites ci-dessus.

    ```js
    function Hero(game, x, y) {
        // ...
        this.animations.add('stop', [0]);
        this.animations.add('run', [1, 2], 8, true); // 8fps en boucle
        this.animations.add('jump', [3]);
        this.animations.add('fall', [4]);
    }
    ```

## Choix de l'animation en cours

1. Calculer quelle animation doit être jouée. Une nouvelle méthode du héros va retourner le nom d'animation.

    ```js
    Hero.prototype.getAnimationName = function () {
        if (this.body.velocity.y < 0) {
            return 'jump';
        }

        if (this.body.velocity.y >= 0 && !this.body.touching.down) {
            return 'fall';
        }

        if (this.body.velocity.x !== 0 && this.body.touching.down) {
            return 'run';
        }

        return 'stop'
    };
    ```

    Notons qu'il faut vérifier si le héros touche ou non le sol. En raison de la **force de gravité**, le héros possède une vitesse verticale même sans qu'il ne bouge.

2. La méthode mise-à-jour `update` du héros va jouer l'animation voulue. Phaser gère pour nous le fait de savoir si l'animation doit être modifiée ou si l'animation en cours persiste.

    ```js
    Hero.prototype.update = function () {
        var animationName = this.getAnimationName();
        this.animations.play(animationName);
    };
    ```

3. Essayons dans le navigateur! Courrons, sautons, etc. Les animations doivent changer. Mais, reste un petit problème, le héros de se tourne pas à gauche et fait un petit _moon-walk_.

    ![Animations… with a glitch!](/assets/platformer/hero_animation_glitch.gif)

## Tourner le caractère dans la bonne direction

1. Aussi bizarre que celà puisse paraître, retourner une image se fait en appliquant un zoom négatif sur une image. Un zoom de `-100%` va créer un miroir horizontal et faire que le héros regarde à gauche.

    Ajouter ceci à la méthode déplacer `move` puisse que la direction est connu à ce moment-là.

    ```js
    Hero.prototype.move = function (direction) {
        // ...
        if (this.body.velocity.x < 0) {
            this.scale.x = -1;
        }
        else if (this.body.velocity.x > 0) {
            this.scale.x = 1;
        }
    };
    ```

Et voilà, le héros se déplace et s'anime correctement.

![Main character, properly animated](/assets/platformer/hero_animations.gif)

# Vérification

- Le héros utilise des animations différentes ou images pour les actions à l'arrêt, course, saut et chute.
- Le héros s'oriente dans la direction de déplacement.
