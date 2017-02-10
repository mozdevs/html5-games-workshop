---
title: Moving forward…
---

**Congratulations**! You completed the workshop and have a playable game you can share with other people.

However, you might have noticed that the finished version of the game is a bit more **polished**:

- It features a loading state (useful for when you publish your game in the Web)
- The main character can jump higher or lower depending on how much time the up arrow key was pressed.
- The main character features a dying animation.
- The main character has a "enter the door" animation for when a level it's finished.
- Camera fade out and fade in

The source code of this version has been provided for you to peek around and learn from it. It doesn't contain significantly _new_ things, so you should be able to follow it along with the help of [Phaser's documentation](http://phaser.io/docs).

A good way of learning would be to try to **replicate those features without seeing the code** beforehand. Check out [Phaser's examples](http://phaser.io/examples), look for tutorials online, answers in online forums, etc. If you get stuck, or are curious about how this was implemented in this case (there's usually more than just one way of doing things!), you have the full source code at your disposal.

## Some tips to take into account

- You can keep an sprite in the world but remove it from all the physics calculations by disabling its body. For example:

    ```js
    this.body.enable = false;
    ```

- [Phaser.Camera](http://phaser.io/docs/2.6.2/Phaser.Camera.html) has methods for fadign in and out.

- You can subscribe to an `onComplete` event of an animation or tween to do something once the animation or tween has finished.

## Game development resources

TODO
