---
title: Lancer un serveur local
layout: default_fr.pug
---

Pour des raisons de sécurité le navigateur web n'autorise pas le chargement de fichiers externe lorsqu'on consulte une page en utilise le protocole `file://`. Ainsi, il est nécessaire d'installer un serveur web pour servir notre jeu.

En fonction des outils à disposition, plusieurs alternatives existes.

# Node.js

[Node.js](https://nodejs.org/) est un plateforme incontournable dès qu'on fait du développement web utilisant beaucoup de JavaScript.

```console
$ npm install -g http-server
$ http-server
```

## Une meilleure alternative

Le désavantage d'un simple serveur web est qu'il est nécessaire de rechercher manuellement une page pour bénéficier des modifications récentes. Le module [browser-sync](https://www.npmjs.com/package/browser-sync) permet de recharger automatiquement la page à chaque modification.

```console
$ npm install -g browser-sync
$ browser-sync --start --server --files="**/*.js"
```

# Python (macOS ou GNU/Linux)

Python est installé par défaut sur plusieurs systèmes d'exploitation et offre par défaut un serveur web.

```console
# Python 2
$ python -m SimpleHTTPServer

# Python 3
$ python -m http.server
```

# WAMP

Si vous avez fait du développement en PHP avec [WAMP](http://www.wampserver.com/fr/), il vous suffit de placer vos fichiers dans le répertoire du serveur web.

# Rien de tout ça

Pas de panique, il y a des alternatives. Certains éditeurs, tel que [Brackets](http://brackets.io/), le font directement.
