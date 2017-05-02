---
title: Mort
layout: guide_step_fr.pug
download: /assets/platformer/steps/step11.js
---

Si nous avons des ennemis, il n'y a aucune intéraction entre eux et le héros. Il est temps de leur permettre de s'entretuer.

- Les araignées vont tuer le héros en le touchant simplement.
_ Le héros ne pourra tuer les araignées que s'il leur saute ou tombe sur la tête.

Comme pour les piècettes d'or, un simple test de chevauchement `overlap` suffira sans devoir gérer une collision complexe.

# Tâches

## Faire que les araignées tues le héros

1. Tuer ou être tuer est un évènement très importan et il est nécessaire de fournir le plus de feedback possible.

    ```js
    PlayState.create = function () {
        this.sfx = {
            // ...
            stomp: this.game.add.audio('sfx:stomp')
        };
        // ...
    };
    ```

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    };
    ```

2. Pour gérer le massacre, il nous faut détecter quand une araignée touche le héros. Comme pour les pièces, le mieux est de le faire par chevauchement.

    ```js
    PlayState._handleCollisions = function () {
        // ...
        this.game.physics.arcade.overlap(this.hero, this.spiders,
            this.onHeroVsEnemy, null, this);
    };
    ```

3. Il reste à ajouter le *callback* traitant le chevauchement d'une araignée et du héros. Pour le moment, nous pouvons tuer le héros et redémarrer le niveau.

    ```js
    PlayState._onHeroVsEnemy = function (hero, enemy) {
        this.sfx.stomp.play();
        this.game.state.restart();
    };
    ```

4. Essayez dans le navigateur et assurez-vous que le débute à nouveau.

## Tuer les araignées

1. Le caractère va tuer les araignées en leur tombant dessus. Du coup, un test possible est de consulter la vitesse verticale du héros à la collision. Si elle est positive, alors il tombe, sinon, c'est qu'il a percuté l'araignée.

    ```js
    PlayState.onHeroVsEnemy = function (hero, enemy) {
        if (hero.body.velocity.y > 0) {
            enemy.kill();
            this.sfx.stomp.play();
        }
        else {
            this.sfx.stomp.play();
            this.game.state.restart();
        }
    };
    ```

2. Essayez-le! Mais l'impression est étrange car le héros passe à travers des araignées. Lui donner un petit rebond aidera à améliorer les sensations offertes par le jeu.

    ```js
    Hero.prototype.bounce = function () {
        const BOUNCE_SPEED = 200;
        this.body.velocity.y = -BOUNCE_SPEED;
    };
    ```

    ```js
    PlayState.onHeroVsEnemy = function (hero, enemy) {
        if (hero.body.velocity.y > 0) {
            hero.bounce();
            // ...
        }
        // ...
    };
    ```

3. Essayez à nouveau. C'est mieux! Non?

    ![Bouncing on enemies](/assets/platformer/enemy_bounce.gif)

## Animations

1. Tuer des ennemis sera encore plus satisfaisant en ajoutant une animation d'agonie. Nous utilisons les deux dernières _frames_ de la feuille de sprites pour celà.

    ```js
    function Spider(game, x, y) {
        // ...
        this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
        // ...
    }
    ```

2. Lorsqu'on appelle `kill` sur un sprite, il disparait immédiatement. En ajoutant une nouvelle méthode de mort `die`, nous pouvons désactiver le corps physique de l'ennemi (plus de collision), jouer l'animation puis effectivement supprimer le sprite avec `kill`

    ```js
    Spider.prototype.die = function () {
        this.body.enable = false;

        this.animations.play('die').onComplete.addOnce(function () {
            this.kill();
        }, this);
    };
    ```

3. Il nous reste à remplacer l'appel à `kill` par un appel à `die`.

    ```js
    PlayState.onHeroVsEnemy = function (hero, enemy) {
        // ...
        if (hero.body.velocity.y > 0) {
            enemy.die();
        }
        // ...
    };
    ```

4. L'animation devrait se jouer.

    ![Spider dying animation](/assets/platformer/enemy_dying.gif)

# Vérifications

- Le héros tue les araignées en leur sautant sur la tête
- Les araignées disparaissent après une petite animation
- Le héro meurt si une araignée lui fonce contre
- Le niveau recommence lors que le héros décède.
