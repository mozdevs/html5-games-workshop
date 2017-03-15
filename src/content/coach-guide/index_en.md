---
title: Guide for coaches and instructors
layout: guide_index.pug
collection_base: setup
author_twitter: ladybenko
author_name: Belén "Benko" Albeza
---

This guide is aimed for coaches/instructors of this workshop. It contains information about the workshop and a few recommendations to run it.

### Methodology

The main part of the workshop is the [_Make a platformer game_](/en/guides/platformer/start-here/) guide. Attendees will create a platformer game with Phaser and JavaScript, step by step.

Full source code is provided, and attendees can complete the whole workshop just by copying and pasting code.

### Target audience

This workshop is aimed at web developers. **Basic knowledge of JavaScript** is required. Although the workshop can be completed just by copying and pasting code, people who can read JavaScript and understand what is going on –or being able to ask the right question– will benefit the most.

### Duration

The workshop is meant to last **a full day**, with lunch and coffee break. A half-day workshop would be possible, but warn people to not to feel bad if they don't complete it. How far they will get depends on the attendees' proficiency with JavaScript or development in general.

In the half-day workshop we ran in Barcelona, the people who were fluent in JavaScript finished the whole workshop and even added some extra features on their own. Most people arrived at least at the part where the main character could jump and pick up coins.

### Preparations

Make sure that all participants can **run a local server** in their machines _before_ the event starts (point them to the [_Setup your machine for HTML5 game development_ en/guides/setup/setup-your-machine/) guide). For people with Mac or Linux machines this is trivial and can be explained at the event (i.e. Python –which comes with a local server– comes pre-installed in these OS), but people running Windows will probably need to download additional software.

It's convenient that an **introduction to game development** is delivered. You can use [this presentation deck](https://belen-albeza.github.io/intro-gamedev/#1) by Belén for this matter. The goal is to provide some basic game development concepts (such as what is a sprite, a bitmap font, game states, etc.) as well as motivation and reasons to **make games for the Web**.

### Venue

Since it's a long workshop and game development can hit the CPU hard, ensure that there are **power outlets** for all participants.

Since there will always be people who have not installed a local server at their machines, ensure that there is Internet connection available, so they can download Apache or install an npm module.

Don't let all women, PoC or other minorities to seat in the back rows –as it is common in most events–. Invite them to take the front seats if they are comfortable on doing so.

### During the workshop

If the attendees don't have a consistent level/skills on JavaScript, don't go step by step: let each person to do the workshop at their own pace.

This was the case at the workshop we ran at Barcelona, and we decided to do at the beginning an overview of all the steps, and then let the attendees to do each step at their will.

Remind people that at the end of each step there is a **checklist** they need to run to ensure they have done stuff properly at that step. Remind them also that they can download the source code of that step, in case they got stuck.

### What if people finish early

Encourage them to try to implement on their own the improvements that the final version has (a death animation for the main character, fade in/out when changing levels, etc.)

Other ideas to suggest:

- Help other attendees to finish the workshop!
- Change the graphics on the game for their own.
- Implement victory and game over screens (this can be done via game states).
- Add a new enemy.
- Make new levels by creating more JSON files.

### What if people can't finish the whole thing

Encourage them to finish the workshop at home! There is enough text available that anybody should be able to complete on their own.
