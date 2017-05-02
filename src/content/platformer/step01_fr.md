---
title: Démarrer avec Phaser
layout: guide_step_fr.pug
download: /assets/platformer/steps/step01.js
---

# Tâches

## Créer le squelette du projet

1. Créer un répertoire pour votre jeu

2. Télécharger et décompressez le [projet de base](/assets/platformer/start.zip). L'arborescence doit ressembler à celle-ci.

  ```bash
  jeu
  ├── audio
  ├── data
  ├── images
  ├── index.html
  └── js
  ```

3. Lancer le serveur web local dans le répertoire racine (voir [install guide](/fr/guides/installation/) et consulter la page dans un navigateur.

  Si vous utilisez l'éditeur _Brackets_, le module _Aperçu en direct_ est amplement suffisant.

## Initialiser Phaser

1. Notre jeu HTML5 va se servir de l'élément `<canvas>` pour dessiner. Phaser peut en créer un pour nous au démarrage. Il nous faut lui fournir l'élément conteneur ainsi que les dimensions de la zone de dessin (960✕600).

  Pour ce faire, modifier `js/main.js` et y ajouter la portion suivante qui va initialiser Phaser.

  ```javascript
  window.onload = function () {
     let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
  };
  ```

  `Phaser.AUTO` va tenter d'utiliser un contexte de type _WebGL_ plus performant qu'un simple canvas 2D.

2. Rafraîchir le navigateur, un carré noir devrait apparaître.

  ![Empy canvas on the screen](/assets/platformer/step00_check.png)

# Vérifications

Avant de passer à l'étape suivante, vérifiez que:

- Vous pouvez accéder au fichier `index.html` depuis votre navigateur
- et qu'un carré noir apparait dans la page.
