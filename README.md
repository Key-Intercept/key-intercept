# Key-Intercept
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Key-Intercept/key-intercept/Test)![GitHub License](https://img.shields.io/github/license/Key-Intercept/key-intercept)![Website](https://img.shields.io/website?url=https%3A%2F%2Fkeyintercept.thomaslower.com%2Flogin.html)![GitHub forks](https://img.shields.io/github/forks/Key-Intercept/key-intercept)![GitHub Downloads (all assets, latest release)](https://img.shields.io/github/downloads/Key-Intercept/key-intercept/latest/total)

Welcome to key-intercept, a plugin for discord which helps you talk ~~un~~properly.

Basically, this is a lil program that sits in the back of your discord. When you send a message it will edit it in some way dependent upon a list of [rules](#rules)

> Note: Vencord is an unsupported use of Discord, to use it is a breach of TOS. Use it, and this plugin, at your own risk.

Contents:

- [Key-Intercept](#key-intercept)
  - [Install](#install)
    - [Windows](#windows)
    - [Linux](#linux)
    - [Build from source](#build-from-source)
      - [Install dependencies](#install-dependencies)
      - [Setup](#setup)
      - [Configuring Vencord](#configuring-vencord)
      - [Discord Injection](#discord-injection)
  - [First time setup](#first-time-setup)
  - [Usage](#usage)
    - [Gag Mode](#gag-mode)
    - [Pet Mode](#pet-mode)
    - [Bimbo mode](#bimbo-mode)
    - [Horny mode](#horny-mode)
    - [Drone mode](#drone-mode)
    - [Rules mode](#rules-mode)
    - [The ladel bot](#the-ladel-bot)
  - [Bugs / Issues](#bugs--issues)
  - [Contributing](#contributing)
  - [Distributing](#distributing)


## Install

This program natively supports Windows (coz you kinda have to in this day and age) and Linux (coz I write the code in that). As a result, this program features 2 install scripts, both named key-intercept-install.

For mac users, the [Linux](#linux) install should work, however, I have no means by which I can test this and will not be maintaining this.

For android users, check the wiki I probs made a page about it

### Windows
To install on Windows:

1. Go to [Releases](https://github.com/Key-Intercept/key-intercept/releases)
2. In that list, you should see a section labelled "Assets" under which you will see a .zip file named `key-intercept-windows.zip`.
3. Click that file to download it
4. Unzip it
5. Go into the folder and double-click `key-intercept-CLICK-ME.bat`
6. A terminal will open, eventually it will wait and ask you to choose something, just press enter
7. Start Discord
8. Go to Discord settings -> plugins and enable key-intercept
9. Enable [The-Ladel](https://discord.com/oauth2/authorize?client_id=1424790082690220052) bot on your account
10. Do /submit on someone to give access to your controls

### Linux
To install on Linux:

1. Go to [Releases](https://github.com/Key-Intercept/key-intercept/releases)
2. In that list, you should see a section labelled "Assets" under which you will see a .zip file named `key-intercept-linux.zip`.
3. Click that file to download it
4. Unzip it
5. Go to that folder in the terminal
6. Make sure discord is closed (fully from the system monitor)
7. Run `key-intercept-install.sh` as `sudo`
8. Press enter when the script appears to hang
9. Start Discord
10. Go to Discord settings -> plugins are enable key-intercept
11. Enable [The-Ladel](https://discord.com/oauth2/authorize?client_id=1424790082690220052) bot on your account
12. Do /submit on someone to give access to your controls

Steps 1-5 & 7 can be accomplished by running the following command:
```sh
curl -s https://api.github.com/repos/Key-Intercept/key-intercept/releases/latest \
| grep -o 'https://[^"]*key-intercept-linux.zip' \
| xargs curl -L -O && unzip key-intercept-linux.zip && cd key-intercept-linux && sudo bash key-intercept-install.sh
```

### Build from source

So, you think you're better than everyone else.

Its fine, I prefer to build from source as well, just makes it feel better tbh doesnt it?

#### Install dependencies

You will need [Node.js](https://nodejs.org/en/download), [pnpm](https://pnpm.io/installation) and [git](https://git-scm.com/install/windows)

#### Setup

First, obviously, clone the repo (im not giving you the command, if you don't know how to do this then don't bother building from source)

You will also need to clone the [Vencord repo](https://github.com/Vendicated/Vencord)

Now, copy the `key-intercept` folder containing the `index.ts` file to `Vencord/src/userplugins/`

#### Configuring Vencord

There is 1 change we need to make to vencord for key-intercept to work. We must edit the csp file.

> Discord is a website tricking you into thinking it is an app. For security reasons it has a set number of links it can connect to for certain pieces of data, anything else is automatically blocked. These links are stored in the csp file. Key-intercept uses a database hosted on supabase for storing your configs (hence how the bot is able to access it). As a result of this, we need to add access to the database to this file.

1. Open up `Vencord/src/main/csp/index.ts`.
2. Go to around like 53 (anywhere within that map is fine)
3. Add the following lines to that file
```ts
"https://*.supabase.co": ConnectSrc,
"wss://*.supabase.co": ConnectSrc,
```

#### Discord Injection

First, close discord from the system monitor

Then, go to the vencord folder and run
```sh
pnpm install && pnpm add @supabase/supabase-js -w
```
This will install all pnpm dependencies including supabase

Then run
```sh
pnpm build
```
to build the project and
```sh
pnpm inject
```
to install the project to Discord (inject must be ran as sudo if you are on linux)

## First time setup

When first installing this, you will most likely want to enable others to control it and edit it. To do this, add [the-ladel](https://discord.com/oauth2/authorize?client_id=1424790082690220052) bot to your account, then run the [/submit](https://github.com/Key-Intercept/key-intercept/wiki/The-Ladel#submit) command to give access.

## Usage

This program has 5 pre-defined ways of using it, and a way of defining custom modes:

> Different modes can be used at the same time with a predefined priority order

> Modes can be set on a timer, to end after a specific amount of time has passed.

> More info can be found in [the wiki](https://github.com/Key-Intercept/key-intercept/wiki/Modes)

### Gag Mode
This mode simulates the user having a gag in their mouth. Replacing text with something mostly illegible

### Pet Mode
This mode allows a random chance for words to be replaced with pet modes

We currently have 7 different pets, each with multiple noises:

- Puppy
- Kitty
- Cow
- Fox
- Bird
- Bee
- Bunny

You can then set a percentage chance that each word will be replaced with a pet word

### Bimbo mode
This mode has 3 features:

1. Every now and then, a random "like" will be inserted between words
2. Every pronoun (1st or 3rd person) will be followed with the phrase "like totally"
3. A maximum word length can be set. If this word count is gone over, the rest of the message will be replaced with "uhh long words harddd hehe"

### Horny mode
Gives a horny percentage, higher percentage means higher chance that random "horny word" with be inserted between your normal words

### Drone mode
This mode has 2 features

1. Adds a header and footer to each message, these are by default "This Drone Says:" and "It Obeys.". They can be changed to whatever you like
2. Adds a "damage" modifier in which the drone can be damaged causing it to glitch with random "beep" and "bzzt" noises, as well as beginning to slur words, if the drones health becomes lower than 10 (starts at 100) it will "bluescreen".

### Rules mode
This enables users to add custom rules which use a system called "Regex".

### The ladel bot

> The name comes from the fact that its creator (me) is occasionally referred to as being "soup-brained"

See the [wiki](https://github.com/Key-Intercept/key-intercept/wiki/The-Ladel) for a full list of commands

## Bugs / Issues

If you experience any bugs or issues, please check the [Issues](https://github.com/Key-Intercept/key-intercept/issues?q=is%3Aissue%20state%3Aopen%20label%3Abug) page. If you can see your issue there then it is something that is actively being fixed, otherwise, create an issue describing your problem.

## Contributing

Check [the wiki](https://github.com/Key-Intercept/key-intercept/wiki/Development#programming)

## Distributing

You can share this plugin in other servers, my recommendation is to just link this page to them.

I do have plans to add a system in which you can "preset" a config to auto install for users.

If you do share this plugin, you are legally required to credit me as the author.