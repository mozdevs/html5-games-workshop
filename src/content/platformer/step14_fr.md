---
title: Fin de partie
layout: guide_step_fr.pug
download: /assets/platformer/steps/step14.js
---

Actuellement, le joueur peut *perdre* une partie mais pas en gagner une.

Pour corriger ceci nous allons ajouter une porte fermée et une clé. Le but du jeu va être de récupérer la clé afin d'ouvrir la porte vers le niveau suivant. Il faudra également ajouter un icône permettant d'indiquer au joueur si la clé a été ramassée ou non.

Dans le fichier JSON du niveau, les positions de la porte et de la clé sont données.

Voici à quoi ressemblera le niveau.

![Level with the win condition elements](/assets/platformer/win_condition.png)

# Tâches

## Créer la porte

1. La porte est une feuille de sprites ouverte ou fermée.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.spritesheet('door', 'images/door.png', 42, 66);
    };
    ```

2. La porte va apparaître sous le héros, ou les ennemis. Il faut donc créer un groupe pour elle avant les autres qui contiendra également les clés et les autres décorations.

    ```js
    PlayState.loadLevel = function (data) {
        this.bgDecoration = this.game.add.group();
        // ...
    };
    ```

    L'ordre des créations des groupes défini l'ordre de dessin. Les derniers étant dessinés en dernier, donc par dessus les autres.

3. Les créations de la porte et de la clé sont séparées.

    ```js
    PlayState.spawnDoor = function (x, y) {
        this.door = this.bgDecoration.create(x, y, 'door');
        this.door.anchor.set(0.5, 1);
        this.game.physics.enable(this.door);
        this.door.body.allowGravity = false;
    };
    ```

    Le corps physique est créé afin de pouvoir détecter les collisions par la suite.

4. Cette méthode est appelée au chargement du niveau.

    ```js
    PlayState.loadLevel = function (data) {
        // ...
        this.spawnDoor(data.door.x, data.door.y);
        // ...
    };
    ```

5. En rechargant le jeu, la porte apparait.

    ![Door](/assets/platformer/door_spawned.png)

## Créer la clé

1. Idem pour la clé qui est une simple image.

    ```js
    LoadingState.preload = function () {
        // ...
        this.game.load.image('key', 'images/key.png');
    };
    ```

2. Et avec une méthode spécifique pour créer la clé.

    ```js
    PlayState.spawnKey = function (x, y) {
        this.key = this.bgDecoration.create(x, y, 'key');
        this.key.anchor.set(0.5, 0.5);
        this.game.physics.enable(this.key);
        this.key.body.allowGravity = false;
    };
    ```

    En plaçant la clé dans le même groupe que la porte, elle sera derrière tout le reste.

3. Il nous reste à appeler cette méthode au chargement du niveau.

    ```js
    PlayState._loadLevel = function (data) {
        // ...
        this.spawnKey(data.key.x, data.key.y);
        // ...
    };
    ```

4. Et voilà, la clé s'affiche en haut à droite.

    ![Static key](/assets/platformer/key_spawned.png)

## Conditions de victoire

1. La condition de la victoire d'atteindre la clé puis la porte. Stockons l'information indiquant si la clé a été récupérée dans l'état du jeu.

    ```js
    PlayState.init = function () {
        // ...
        this.hasKey = false;
    };
    ```

    Ce drapeau va être placé à vrai `true` par la suite.

2. Pour permettre au joueur d'avoir un retour intéressant, avoir des sons est primordial. Chargons les sons de la porte et de la clé.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.audio('sfx:key', 'audio/key.wav');
        this.game.load.audio('sfx:door', 'audio/door.wav');
    };
    ```

    ```js
    PlayState.create = function () {
        this.sfx = {
            key: this.game.add.audio('sfx:key'),
            door: this.game.add.audio('sfx:door'),
            // ...
        };
        // ...
    };
    ```

3. L'intéraction entre le héros et la clé se fait au chevauchement des deux. Le son est joué et le sprite de la clé ôté. Il est important de changer l'état permettant de mémoriser que la clé a été collectée.

    ```js
    PlayState.handleCollisions = function () {
        // ...
        this.game.physics.arcade.overlap(this.hero, this.key, this.onHeroVsKey,
            null, this)
    };
    ```

    ```js
    PlayState.onHeroVsKey = function (hero, key) {
        this.sfx.key.play();
        key.kill();
        this.hasKey = true;
    };
    ```

4. Testons le jeu. Le clé doit disparaître et le son se jouer.

5. Plus compliqué, la collision entre le héros et la porte qui implique de gérer une condition.

    ```js
    PlayState.handleCollisions = function () {
        // ...
        this.game.physics.arcade.overlap(this.hero, this.door, this.onHeroVsDoor,
            this.canHeroVsDoor, this);
    };
    ```

    ```js
    PlayState.canHeroVsDoor(hero, door) {
        return this.hasKey && hero.body.touching.down;
    }
    ```

    La collision doit avoir lieu **si** la clé a été ramassée et le héros touche le sol.

6. La collision entre le héros et la porte si les conditions le permettent joue le son et redémarre le niveau.

    ```js
    PlayState.onHeroVsDoor = function (hero, door) {
        this.sfx.door.play();
        this.game.state.restart();
        // TODO: go to the next level instead
    };
    ```

    Plus tard, il nous faudra passer au niveau suivant.

7. Essayons! Le niveau devrait recommencer.

## Animer la clé

1. La clé, bien qu'étant l'élément important du jeu est relativement peu visible. Il n'y a pas de feuille de sprite mais il serait bien de pouvoir l'animer quand même. Créons une animation de mouvement.

    Phaser nous permet de faire ceci à l'aide d'un *Tween* qui vient de l'anglais *inbetween* signfiant interpolation. La bibliothèque jQuery permet des résultat similaires.

    ```js
    PlayState.spawnKey = function (x, y) {
        // ...
        this.key.y -= 3;
        this.game.add.tween(this.key)
            .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
            .yoyo(true)
            .loop()
            .start();
    };
    ```

    L'interpolation va déplacer la clé de haut en bas dans un mouvement sinusoïdal.

2. La clé devrait à présent osciller de haut en bas de manière non-linéaire.

    ![Key tweening](/assets/platformer/key_tween.gif)

## Icône

1. Et finalement, nous allons ajouter un clé au _HUD_. Il nécessaire de charger le sprite.

    ```js
    PlayState.preload = function () {
        // ...
        this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);
    }
    ```

2. Puis de créer l'image et de l'ajouter à l'affichage. `19` permet de centrer l'image verticalement par rapport à la pièce d'or.

    ```js
    PlayState.createHud = function () {
        this.keyIcon = this.game.make.image(0, 19, 'icon:key');
        this.keyIcon.anchor.set(0, 0.5);
        // ...
        this.hud.add(this.keyIcon);
    };
    ```
3. La pièce d'or doit également être décalée vers la droite.

    ```js
    PlayState.createHud = function () {
        // ...
        var coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
        // ...
    };
    ```

4. En rechargeant la page, la clé s'affiche à côté de la pièce.

    ![Key icon (empty frame)](/assets/platformer/key_icon_empty.png)

5. Dernière étape. Utiliser le bon sprite en fonction de si la clé a été capturée ou non. Un peu comme pour une animation, il est possible de spécifier une image (`frame`) pour le sprite.

    ```js
    PlayState.update = function () {
        // ...
        this.keyIcon.frame = this.hasKey ? 1 : 0;
    };
    ```

6. Tadaaa!

    ![Key icon (filled)](/assets/platformer/key_icon_filled.png)

# Vérifications

- La porte et la clé sont affichées
- Si le caractère ramasse la clé, elle disparaît et un effet sonore est joué
- Le niveau recommence quand le caractère passe la porte après voir ramassé la clé
- Rien ne se passe si le héros passe la porte sans avoir ramassé la clé
- Il y a un icône indiquant si la clé a été ramassée
