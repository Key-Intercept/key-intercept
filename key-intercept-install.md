hihi cuties, that program you've probs seen me using and testing throughout the server is FINALLY publically available.

May I presest: **Key-Intercept**

This program will edit your messages as you send them to discord. And has a few fun little ways to control how its edited. All controllable through my lovely little discord bot "The Ladel" (get it coz im soup brained hehe)

Anywho. First thing to know about this program is it is for Doms and Subs, to use together. The sub will install the program while the dom can use the bot to control it.

So now, the bit youve been waiting for. What the heck does this program actually do? Weeeeeelll, we have a few modes:

- Rules Mode ||where your dom can be specific with how you type||.
- Gag Mode ||for when your silly little mouth needs shutting up||.
- Pet Mode ||coz human words are hard, much easier to bark or meow or even mooooooo||.
- Bimbo Mode ||coz like words is like totally hard, much better to just be dumb and pretty||.
- Drone Mode ||coz you don't think, you just obey||.
- Horny Mode ||coz mfmfff please i need to CUMMM ahhh guhhh im so hornyyyyyyyy||.

All of these modes can be used together, meaning you can be a gagged, bimbo cow who has to end each sentence with "I LOVE OWNER".

They can also be set to a timer, or left on indefinitely.

> Little sidenote: I am not a dom please do not ask me to use this program on you. I will probably say no.

## Installation

Now you know what youre getting into, you probably wanna know how to get into it.
Welll, I've been so very kind and included a nice little install script for you.
So heres what you need to do:

> Please Note: This plugin requires the use of vencord which is an unofficial extension for discord. If you do not wish to install this then you cannot use this plugin, sorry.

1. Make sure you have [git](https://git-scm.com/downloads) and [NodeJS](https://nodejs.org/en/download/current) installed.
2. Download the folder at [this link](https://mega.nz/folder/FdEFAAgY#A2bJ6BdH8YBQ4PZgxCMQlw).
3. Unzip that folder.
4. Run the .bat or .sh script (.bat if on windows, otherwise .sh on macos and linux).
5. At the end of this script, you will need to press enter once. (If nothing happens for 10 secs, assume you need to press enter).
6. Restard Discord.
7. Drink some water if you haven't today.
8. Go to Discord Settings > Vencord > Plugins and search for key-intercept.
9. Enable the plugin.

If you are a dom and want to use the bot to control this program then use [this link](https://discord.com/oauth2/authorize?client_id=1424790082690220052). This will add the bot to that little game controller icon on discord, you can use it anywhere other than DMs (although you can DM the bot directly).

> Before you can use the bot: As a consent safety measure, the sub will need to run `/submit-to-dom` on their chosen dom (or doms) to give them access to the controls.

## Rules mode explanation (subs can ignore this)

Most modes are pretty self explanatory, however, Rules Mode is a bit more complex, but basically lets you define custom modes. It uses a thing called regex which is a language used to match patterns in text. Here are a few helpful tips:

- + means repeat 1 or more times
- asterix means repeat 0 or more times
- ? means repeat 1 or 0 times
- (?i) at the start of the rule means ignore case
- \w is any word
- \b is and blank space (including spaces and the starts and ends of messages)
- ^ is the start of a message
- $ is the end of a message
- . is anything
- | is this or that

### A Few Examples

- \w+ captures all words and replaces them with your replacement
- .* is an entire message
- (?i)\b(he)+\b is he, hehe, hehehe, Hehehe, hEhEHe, etc...
- ^hello is any message beginning with hello

## Uninstall

Sorry to see you go, but I get it. There are a few different levels of uninstall

### Just stop the plugin

Remember when you installed, you had to do step 7, go do it again and then simply disable the plugin rather than enabling it.

### Uninstall Vencord

Fair enough, you wanna be a good lil discord user. So here you will need to go to $HOME (for windows thats `C:\Users\<your_username>` and delete the folder called `Vencord`.
Then, go to [Vencord Website](https://vencord.dev/download/) and download the installed (ironically), then select uninstall.
Tada, you're free.

### Delete User Data

This plugin does store a tiny amount of user data (your discord username). You are completely free to ask me to delete your data at any point, simply DM me and I will (it takes me 2 mins maximum so it is no trouble).
