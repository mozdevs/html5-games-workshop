---
title: Ennemis
layout: guide_step_fr.pug
download: /assets/platformer/steps/step10.js
---

Le seul challenge du jeu en l'état est de sauter correctement. Ni super fun, ni compliqué étant donné qu'il n'est pas possible de sortir de l'univers. Il est temps d'ajout du danger sous forme d'ennemis velus.

Voici l'impressionnate araignée!

![Walking spider](/assets/platformer/walking_spider.gif)

Cet ennemi possède un comportement simple : il se déplace horizontalement de gauche à droite sans tomber des plateformes ou traverser les murs.

L'araignée est animée à l'aide la feuille de sprite suivante.

![Invisible walls](/assets/platformer/invisible_walls.png)

Pour que l'araignée ne tombe pas des plateformes, nous allons utiliser un truc nommé **murs invisibles**. Ces murs seront des sprites, avec un corps physique, mais masqués. Le héros les ignorera complétement mais pas les araignées qui les toucheront et feront demi-tour.

Voici à quoi ressembleraient les murs, s'il étaient affichés. Il y a un au bord
de chaque plateforme.

![Invisible walls](/assets/platformer/invisible_walls.png)

# Tâches

## Créer le sprite pour l'ennemi

1. Précharger l'image liée à l'araignée dont chaque sprite fait `42×32`.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    };
    ```

2. Comme pour le héros, ne devons spécialiser un `Phaser.Sprite` gérant la vie d'une araignée. Dans le constructeur, nous activons la physique et ajoutons deux animations : une de marche et une autre de mort.

    ```js
    function Spider(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'spider');

        this.anchor.set(0.5, .5);
        // animations
        this.animations.add('crawl', [0, 1, 2], 8, true);
        this.animations.play('crawl');

        // physique
        this.game.physics.enable(this);
        this.body.collideWorldBounds = true;
        this.body.velocity.x = -this.SPEED;
    }

    // inherit from Phaser.Sprite
    Spider.prototype = Object.create(Phaser.Sprite.prototype);
    Spider.prototype.constructor = Spider;
    Spider.prototype.SPEED = 100;
    ```

## Afficher les araignées

1. Le fichier JSON du niveau contient les informations des araignées `spiders` devant être crées. Il est important de créer un groupe pour elles afin de simplifier la gestion des collisions.

    ```js
    PlayState._loadLevel = function (data) {
        // ...
        this.coins = this.game.add.group();
        this.spiders = this.game.add.group();
        // ...

        this.spawnCharacters({hero: data.hero, spiders: data.spiders});
    };
    ```

2. Depuis la création des caractères, créons chaque araignée avec un boucle `forEach`.

    ```js
    PlayState._spawnCharacters = function (data) {
        // ...
        data.spiders.forEach(function (spider) {
            let sprite = new Spider(this.game, spider.x, spider.y);
            this.spiders.add(sprite);
        }, this);
    };
    ```

3. On essaie... et paf! C'est la catastrophe.

    ![Spiders affected by gravity](/assets/platformer/spider_disaster.gif)

    Les araignées se cassent la gueule car elles subissent la gravitation, sont restreintes par les limites du monde mais ne possède pas de collisions avec les plateformes.

## Résoudre les collisions

1. La première étape est d'ajoute une collision entre araignées et plateformes.

    ```js
    PlayState._handleCollisions = function () {
        this.game.physics.arcade.collide(this.spiders, this.platforms);
        // ...
    };
    ```

    Les araignées tombent des plateformes à présent.

## Ajouter les murs invisibles

1. Ajoutons les murs invisibles pour prévenir d'horribles chutes aux araignées. Il est important de précharger l'image, qui ne sera pas affichée mais servira a définir la taille des murs.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.image('invisible-wall', 'images/invisible_wall.png');
        // ...
    };
    ```

2. Ajouter ces murs à un groupe permettra de gérer les collisions avec les araignées.

    ```js
    PlayState._loadLevel = function (data) {
        // ...
        this.spiders = this.game.add.group();
        this.enemyWalls = this.game.add.group();
        // ...
    };
    ```

3. Pour chaque plateforme, il faut créer deux faux murs à gauche et droite de la plateforme. L'ancre en x vallant parfois `0`, parfois `1` va permettre d'aligne à gauche ou droite le mur par rapport au bord de la plateform.

    ```js
    PlayState.spawnPlatform = function (platform) {
        // ...
        this.spawnEnemyWall(platform.x, platform.y, 'left');
        this.spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
    };
    ```

    ```js
    PlayState._spawnEnemyWall = function (x, y, side) {
        let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
        // ancrage en y et décalage en x.
        sprite.anchor.set(side === 'left' ? 1 : 0, 1);

        // physique
        this.game.physics.enable(sprite);
        sprite.body.immovable = true;
        sprite.body.allowGravity = false;
    };
    ```

4. Ajoutons les collisions entre les faux-murs et les araignées afin qu'elles ne puissent les traverser.

    ```js
    PlayState.handleCollisions = function () {
        this.game.physics.arcade.collide(this.spiders, this.platforms);
        this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
        // ...
    };
    ```

5. À présent, les araignées se bloquent contre les plateformes.

    ![Spider blocked by wall](/assets/platformer/spider_vs_wall.png)

6. Il semble qu'on peut masquer les faux-murs en mettant la propriété `visible` à faux `false`.

    ```js
    PlayState._loadLevel = function (data) {
        // ...
        this.enemyWalls = this.game.add.group();
        this.enemyWalls.visible = false;
        // ...
    };
    ```

## Débloquer les araignées

1. Nous avons vu qu'il existe un valeur nommée `touching` permettant de savoir si le corps physique touche un autre élément. Ce que nous allons utiliser pour changer de sens l'araignée bloquée.

    Cependant, nous devons également effectué un autre test avec bloqué `blocked` pour savoir si l'araignée est face aux limites du monde.

    Ajoutons une méthode mise-à-jour `update` à l'araignée. Cette méthode est appelée **automatiquement** par Phaser chaque frame. Il est important de placer ceci *après* avoir copié le `prototype` du parent.

    ```js
    Spider.prototype.update = function () {
        // check against walls and reverse direction if necessary
        if (this.body.touching.right || this.body.blocked.right) {
            this.body.velocity.x = -this.SPEED;
            this.scale.x *= -1
        }
        else if (this.body.touching.left || this.body.blocked.left) {
            this.body.velocity.x = this.SPEED;
            this.scale.x *= -1
        }
    };
    ```

Et voilà, les araignées se déplacent et se retournent au changement de sens.

![Spider turning into the opposite direction](/assets/platformer/spider_turning.gif)


# Vérifications

- Trois araignées toutes mignonnes se déplacent sur les plateforme sans en choïr ni passer à travers.
- Les araignées font demi-tour si elle rencontre un obstacle ou le bord d'une plateforme.
- Le héros n'influe aucunement sur la vie des araignées.
