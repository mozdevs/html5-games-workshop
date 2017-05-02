---
title: Changer de niveau
layout: guide_step_fr.pug
download: /assets/platformer/steps/step15.js
---

Nous avons les conditions de la victoire mais redémarrons le même niveau. Peu intéressant. Dans le répetoire `data`, il y a deux niveaux: `level00.json` et `level01.json`. Utilisons-les!

Le jeu va commencer avec le niveau zéro puis passer au niveau un.

À la fin du niveau deux, nous recommencerons au début, mais rien n'empêche de créer de nouveaux univers.

Un moyen de passer d'un niveau à l'autre et de donner le niveau en cours à l'état du jeu `PlayState`. Nous allons passer des paramètres à `init`.

# Tâches

## Chargement de tous les niveaux

1. Ajoutons le niveau zéro dans les fichiers à précharger.

    ```js
    PlayState.preload = function () {
        this.game.load.json('level:0', 'data/level00.json');
        // ...
    };
    ```

2. Au démarrage de l'état `init`, la propriété niveau `level` contiendra le niveau en cours.

    ```js
    PlayState.init = function (data) {
        // ...
        this.level = (data.level || 0) % 2;
    };
    ```

    Notez que `% 2` est nécessaire pour retourner à zéro si la valeur dépassait 2. Et le `|| 0` est la syntaxe utilisée en JavaScript pour définir une valeur par défaut.

3. À la création du niveau `create`, la propriété niveau va permettre de charger le niveau en cours.

    ```js
    PlayState.create = function () {
        // ...
        this.loadLevel(this.game.cache.getJSON("level:" + this.level));
        // ...
    };
    ```

4. Maintenant, il suffit de donner le niveau en cours à `init` à la création.


    ```js
    window.onload = function () {
        // ...
        // change the line below for the new one!
        // game.state.start('play');
        game.state.start('play', true, false, {level: 0});
    };
    ```

    Le premier `true` indique à Phaser de conserver le cache. Et le second `false` indique de ne pas conserver les éléments existant. Il supprime touts les sprites, textes, groupes, etc. Ce sont les valeurs par défaut.

5. Essayons, le niveau zéro doit s'afficher.

    ![The first level](/assets/platformer/level00_thumb.png)

## Changer de niveau

1. `init` demande un argument contenant le niveau, il faut donc le lui donner au redémarrage `restart`.

    ```js
    PlayState.onHeroVsDoor = function (hero, door) {
        // ...
        this.game.state.restart(true, false, { level: this.level + 1 });
    };
    ```

2. Et également quand le héros décède mais sans passer au niveau suivant.

    ```js
    PlayState._onHeroVsEnemy = function (hero, enemy) {
        // ...
        else {
            // ...
            this.game.state.restart(true, false, {level: this.level});
        }
    };
    ```

Et voilà, il doit être possible de jouer aux deux univers.

# Vérifications

- Le jeu débute au niveau zéro
- Passer la porte change de niveau
- À la fin, on recommence au niveau zéro
- Quand le héros décède, le niveau actuel recommence.
