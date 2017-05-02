---
title: Sauts
layout: guide_step_fr.pug
download: /assets/platformer/steps/step08.js
---

La gravité en place, il est quasiment trivial de gérer le saut du héros. En cours de physique, vous avez peut-être vu qu'un mouvement uniformément accéléré, tel que celui donc l'accéleration est une force de gravité, produit un mouvement parabolique.

À la pression de la touche flèche haut, le héros a sauter en lui donnant une vitesse verticale. Nous allons également jouer un jon quand ceci se produit. Dans un jeu, le son est critique pour fournir un retour à la joueuse ou au joueur.

# Tâches

## Détecter la touche flèche haut

1. Comme pour les touches gauche et droite, nous ajoutons la touche flèche haut.

    ```js
    PlayState.init = function () {
        // ...
        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT,
            up: Phaser.KeyCode.UP
        });
    };
    ```
2. Auparavant, nous vérifions l'état d'une touche lors de la mise à jour `update`. Pour le saut, nous allons utiliser une solution alternative. Il est possible d'effectuer une action au moment où la touche est pressée.

    ```js
    this.keys.up.onDown.add(function () {
        this.hero.jump();
    }, this);
    ```

<small>L'argument supplémentaire donné au `add`, ici `this` sert à donner un contexte à la fonction créée. Une spécialité liée au fonctionnement de JavaScript.</small>

## Réaliser la méthode de saut

1. La méthode sauter `jump` peut être ajoutée à notre héros.

    ```js
    Hero.prototype.JUMP_SPEED = 600;

    Hero.prototype.jump = function () {
        this.body.velocity.y = -this.JUMP_SPEED;
    };
    ```

2. Essayez dans le navigateur! Il saute. Mais il saute également en l'air, comme s'il savait voler. Cependant, si vous êtes un·e joueu·r.se aguéri, le double-saut ne vous est pas forcément inconnu.

3. Nous allons imposer au héros un seul saut. Le moteur physique gérant les collisions peut nous informer des collisions en cours de notre objet. Tester la collision avec le sol implique qu'on peut sauter.

    ```js
    Hero.prototype.jump = function () {
        let canJump = this.body.touching.down;

        if (canJump) {
            this.body.velocity.y = -this.JUMP_SPEED;
        }

        return canJump;
    };
    ```

<small>Savoir si le saut a été possible, nous permettra de jouer un saut par la suite.</small>

## Jouer un son au saut

1. Les sons sont des assets du jeu comme les autres, qu'il faut précharger.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.audio('sfx:jump', 'audio/jump.wav');
    };
    ```

2. La phase de création va créer l'instance d'un son `Phaser.Sound` dans notre jeu. Un son se crée de la même manière qu'une image mais via la fonction `audio`.

    ```js
    PlayState.create = function () {
        // ...
        this.sfx = {
            jump: this.game.add.audio('sfx:jump')
        };
    };
    ```

3. Et finalement, jouons un saut lorsqu'un saut est fait en adaptant la fonction de la touche.

    ```js
    PlayState.init = function () {
        // ...
        this.keys.up.onDown.add(function () {
            let didJump = this.hero.jump();
            if (didJump) {
                this.sfx.jump.play();
            }
        }, this);
    };
    ```

Et voilà, le héros se déplace et avec un peu d'entrainement, il sera possible d'atteindre toutes les plateformes.

![Main character jumping](/assets/platformer/hero_jump.gif)

# Vérifications

- Le héros saute!
- Il ne peut pas sauter sans être sur une plateforme.
- Un son est joué au saut.
