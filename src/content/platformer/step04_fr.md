---
title: Le caractère principal
layout: guide_step_fr.pug
download: /assets/platformer/steps/step04.js
---

Le héro ou héroïne ne notre jeu sera un autre **sprite**. Cependant ce sprite est plus complexe que les plateformes. Il y a plus de logiques associées au joueur comme le déplacement, le saut, etc.

Il semblerait judicieux d'ajouter des méthodes comme sauter (`jump`) ou se déplacer (`move`). On fait ceci est dérivant (appelé héritage) `Phaser.Sprite`.

En JavaScript, le patron de conception suivant utilisé. Imaginons que nous devions créer une classe voiture (`Car`) spécialisant une classe véhicule (`Vehicle`).

```javascript
function Car() {
    // call parent constructor
    Vehicle.call(this);
}

// clone Vehicle's prototype into Car
Car.prototype = Object.create(Vehicle.prototype);
// restore the constructor at Car
Car.prototype.constructor = Car;
```

Nous allons nous en servir pour spécialiser `Phaser.Sprite`.

# Tâches

## Charger l'image du héro

1. Dans l'étape `preload`, ajouter le chargement de l'image `hero_stopped.png`.

  ```javascript
  PlayState.preload = function () {
      // ...
      this.game.load.image('hero', 'images/hero_stopped.png');
  };
  ```

  ### Spécialiser `Phaser.Sprite`

2. Ajoutez la définition du héro dans `main.js`. On suit le patron d'héritage utilisé en JavaScript.

  ```javascript
  function Hero(game, x, y, image) {
      // Appel le constructeur de Phaser.Sprite
      Phaser.Sprite.call(this, game, x, y, 'hero');
  }

  // inherit from Phaser.Sprite
  Hero.prototype = Object.create(Phaser.Sprite.prototype);
  Hero.prototype.constructor = Hero;
  ```

## Afficher le héro à la création

1. Comme pour les plateformes, la position du héro est donnée dans le fichier JSON. Nous créons une nouvelle méthode permettant d'afficher les caractères.

  ```javascript
  PlayState.loadLevel = function (data) {
     //...
     this.spawnCharacters({hero: data.hero});
  };
  ```

  ```javascript
  PlayState.spawnCharacters = function (data) {
     this.hero = new Hero(this.game, data.hero.x, data.hero.y, 'hero');
     this.game.add.existing(this.hero);
  };
  ```

2. Après rafraichissement de la page, le personnage apparait... cependant il semble mal positionné.

  ![Un héro mal positionné](/assets/platformer/hero_bad_position.png)

3. Phaser gère le positionnement d'un _sprite_ à l'aide d'un ancre (`anchor`). C'est un vecteur x, y allant de 0 à 1 (gauche - droite, haut - bas). Afin de center le héro, il faut le placer à la position `(0.5, 0.5)c)`. Modifier le constructeur du héro de la manière suivante.

  ```javascript
  function Hero(game, x, y) {
     // ...
     this.anchor.set(0.5, 0.5);
  }
  ```

Et voilà, le héro à désormais les pieds sur terre.

![Hero positioned correctly in the scenario](/assets/platformer/step03_check.png)

# Vérifications

- Il y a un personnage sur le sol positionné en bas à gauche du niveau.
