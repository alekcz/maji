![maji-studio-banner](https://maji-studio-examples.firebaseapp.com/assets/maji-studio-github.png)

# Maji Studio

An atom package for prototyping interactions using mo.js and framer.js.

## Project status
Activity: In active development

Stability: Unknown (assume unstable)

## Installing Maji Studio

### Install Atom Editor
Maji Studio is actually an add-on or package for [Atom Editor](https://atom.io/). You need to
install Atom first.


#### Installing Atom on Ubuntu
1. Open terminal (Ctrl+Alt+T)
2. Run the command: `sudo add-apt-repository ppa:webupd8team/atom`
3. Run the command: `sudo apt update; sudo apt install atom`

#### Installing Atom on OS X
1. Download the zip file [https://atom.io/download/mac](https://atom.io/download/mac)
2. Extract the zip file
3. Drop the Atom app into Applications

#### Installing Atom on Windows
1. Download the installer file [https://atom.io/download/windows](https://atom.io/download/windows)
2. Run the installer
3. Next. Next. Finish.


### Installing the Maji Studio Plugin

1. Open `Atom > Preferences` (or `File > Settings` on Windows).
2. In the `Setting` tab select `Install`
3. Search for Maji Studio
4. Install Maji Studio


##  Maji Studio Crash Course

### New Maji Studio Project
1. Use the menu bar and select `Maji Studio > New Maji Studio Project`.
2. Select `Create Project` on the popup that appears.
3. The new project will me create in you user directory in a folder called `maji/<random-project-name>`.
4. Maji Studio will automatically open the newly created project.

### Preview mode
In order to view the prototype (only mobile prototypes are available at the moment), preview mode needs to
be activated. To activate Preview Mode using the menu bar select `Maji Studio > Show Preview` or press `Ctrl+Alt+M`.

Preview Mode can only be activated if there is an active workspace. Open a folder to create a workspace or `.framer` file.

The preview pane refreshes each time a file is saved.

### Library and Language Choices

Code may be written in either `app.js` or `app.coffee` depending on whether you are using mo.js or framer.js.

#### Mo.js
If animating or prototyping using [mo.js](http://mojs.io/) the better language choice is javascript.
Coffee script may also be attempted. It may end badly.

#### Framer.js
If animating or prototyping using [framer.js]() ([github](https://github.com/koenbok/Framer)) either javascript or coffeescript
may be used.

#### Selecting the library and language

- To select mo.js as the animation library the first command in app.js should be `useMojs();`
- To select framer.js as the animation library (using **javascript**) the first command in app.js should be `useFramer();`
- To select framer.js as the animation library (using **coffeescript**) the first command in app.js should be `useFramerWithCoffee();`

If coffeescript is selected write your code in `app.coffee`


### Shortcuts
There are current only a few commands in Maji Studio. They are as follows.

1. Open preview mode: `Ctrl+Alt+M`
2. Close preview mode: `Ctrl+Alt+C`
3. Create new Maji Studio Poject: `Ctrl+Alt+N`


## Useful links

### Mo.js
The motion graphics toolbelt for the web

Website: [http://mojs.io/](http://mojs.io/)

Github:  [legomushroom/mojs](https://github.com/legomushroom/mojs)

Creators twitter handle: [@legomushroom](https://twitter.com/legomushroom)

### Framer.js
Framer - Design Everything

Website: [https://framer.com/](https://framer.com/)

Github:  [koenbok/Framer](https://github.com/koenbok/Framer)

Creators twitter handle: [@koenbok](https://twitter.com/koenbok)

## Licenses

### Mo.js
The MIT License (MIT)

Copyright (c) Oleg Solomka [@legomushroom](https://twitter.com/legomushroom) legomushroom@gmail.com

### Framer.js
The MIT License (MIT)

Copyright (c) 2014 Koen Bok [@koenbok](https://twitter.com/koenbok)


### Maji Studio
The MIT License (MIT)

Copyright (c) 2017 Alexander Oloo [@alekcz](https://twitter.com/alekcz) alekcz@gmail.com
