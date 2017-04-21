---
title: Démarrer
layout: guide_index_fr.pug
collection_base: platformer
author_twitter: ladybenko
author_name: Belén "Benko" Albeza"
---

Nous allons créer un classique jeu de plateforme. Notre héros ou héroïne pourra courir, sauter sur des plateforme avec pour objectif de récolter une clé ouvrant la porte vers le niveau suivant. Des ennemis devront être évités, ou tués.

[![Capture d'écran](/assets/platformer/platformer_screenshot.png)](/platformer/)

Testez le jeu sur [la page suivante](/platformer/).

Nous allons réaliser les différentes étapes:

- **chargement** d'images, de ressources externes;
- gestion des **états** du jeu;
- afficher des **images** à l'écran;
- réalisation des **_sprites_**;
- lire les **actions** du joueur, de la joueuse depuis le clavier
- utiliser le moteur physique pour déplacer les éléments et gérer les collision;
- écrire du texte à l'aide d'une police de type bitmap;
- jouer une musique de fond ainsi que des effets sonores

Nous allons nous concentrer sur l'utilisation de l'interface offerte par [Phaser](http://phaser.io/). Le développement JavaScript moderne et avancé ne sera pas couvert.

Cependant rien ne vous empêche de vous servir des concepts avancés que vous connaissez déjà.

# Phaser

Ce guide utilise Phaser 2.6\. Si d'aventure l'API de cette bibliothèque devait dans le futur, il est possible que les exemples fournis ne soient plus 100% corrects.

# Rendons à César

Les fichiers d'images et de sons, ils sont disponible dans le domaine public sous la licence CC0.

- les images ont été créé par le fameux [Kenney](http://www.kenney.nl/);
- les sons d'arrière-plan provient a été créé par [Rick Hoppmann](http://www.tinyworlds.org/);
- et les effets sonores à l'aide de [bfxr](http://www.bfxr.net/).
