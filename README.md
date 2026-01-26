# Key-Intercept
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Key-Intercept/key-intercept/Test)![GitHub License](https://img.shields.io/github/license/Key-Intercept/key-intercept)![Website](https://img.shields.io/website?url=https%3A%2F%2Fkeyintercept.thomaslower.com%2Flogin.html)![GitHub forks](https://img.shields.io/github/forks/Key-Intercept/key-intercept)![GitHub Downloads (all assets, latest release)](https://img.shields.io/github/downloads/Key-Intercept/key-intercept/latest/total)

Welcome to key-intercept, a plugin for discord which helps you talk ~~un~~properly.

Basically, this is a lil program that sits in the back of your discord. When you send a message it will edit it in some way dependent upon a list of [rules](#rules)

Contents:

- [Install](#install)
    - [Windows](#windows)
    - [Linux](#linux)
    - [Build from Source](#build-from-source)
- [Rules](#rules)
- [Bugs/Issues](#bugs--issues)
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

## Rules

## Bugs / Issues

## Contributing

## Distributing

You can share this plugin in other servers, my recommendation is to just link this page to them.

I do have plans to add a system in which you can "preset" a config to auto install for users.