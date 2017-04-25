---
title: Utilisation de la physique
layout: guide_step_fr.pug
download: /assets/platformer/steps/step06.js
---

Dans les étapes précédentes, nous avons lié le mouvement à une valeur par image. Ce qui signifie que la vitesse du héros est liée à la fréquence de rafraîchissement du jeu. Le nombre d'images par seconde. Cependant, il serait plus judicieux d'utiliser le temps.

Nous pourrions le faire à la main en calculant la **différence de temps** entre deux images, mais Phaser nous offre une solution bien plus élégante : **un moteur physique**.

Les moteurs physiques sont généralement très coûteux en termes de calculs. Phaser utilise une solution petite et très rapide nommée Arcade Physics. Bien que limité à des formes rectangulaires sans rotation, il sera amplement suffisant pour les besoins d'un jeu comme le nôtre et sans créer de dégradation de performance.

Nous utiliserons le moteur physique pour gérer les déplacements, mais aussi, par la suite, la gravité, les collisions, etc.

Le point crucial à prendre en compte est que chaque sprite possède un corps physique `body`, et ce corps est déplaclé, tourné, etc. par le moteur. Phaser va automatiquement mettre à jour les propriétés de l'objet comme sa position (`x, y`) nous évitant d'avoir à le faire.

# Tâches

## Ajouter un corps physique au héros

1. Pour ce faire, il suffit d'activer `enable` la physique du _sprite_.

    ```js
    function Hero(game, x, y) {
        // ...
        this.game.physics.enable(this);
    }
    ```

2. La méthode de délacement `move` travaillant sur la position. Nous allons à présent laisser le moteur physique gérer celà pour nous et simplement agir sur la vitesse de déplacement.

    ```js
    Hero.prototype.SPEED = 200;

    Hero.prototype.move = function (direction) {
        this.body.velocity.x = direction * this.SPEED;
    };
    ```
3. Essayez dans le navigateur! Il bouge, oui? Mais il ne s'arrête pas.

## Stopper le héros

1. À présent que le héros possède une vitesse, il est important de remettre cette vitesse à zéro quand aucune touche n'est enfoncée.

    ```js
    PlayState.handleInput = function () {
        if (this.keys.left.isDown) {
            // ...
        }
        else if (this.keys.right.isDown) {
            // ...
        }
        else {
            this.hero.move(0);
        }
    };
    ```

## Contraindre la héros aux limites de l'écran

1. Un avant-goût de ce qu'un moteur physique peut faire pour nous presque gratuîtement est d'empêcher le héros de sortir des limites de l'écran. Dans Phaser, ceci se fait en activant un drapeau sur le corps physique. Modifiez donc le constructeur du héros pour activer la collision avec les limites du monde (`collideWorldBounds`).

    ```js
    function Hero(game, x, y) {
        // ...
        this.body.collideWorldBounds = true;
    }
    ```

# Vérifications

- Le héro se déplace toujours à gauche ou droite à l'aide des flèches
- Il stoppe au relâchement des touches
- Il ne peut sortir de l'écran
