# Tvillings

This repository is a simple discord bot that uses messages scraped from your friends to impersonate them. 
This bot sends messages with their names and profile pictures using webhooks, with the content generated using Markov Chains (NOT with AI, there is no involved in this project whatsoever!)

<img width="470" height="814" alt="Tvilling_preview" src="https://github.com/user-attachments/assets/ae31833f-bf94-41eb-afbb-1f85b9f9aa0d" />

## Setup instructions
- Set up a discord bot to work with this repo (see notes).
- Set up webhooks for every channel that you want this bot to work in
- Copy .env.sample and data.json.sample, and remove the .sample from each
	- Edit them with your own information (see notes)
- Copy your friend's scraped messages into the directory you configured in data.json (./messageFolder by default)

## Notes
- Markov chain text generation has nothing to do with AI, there is no reasoning going on in the text generation at all. Your messages will just not make sense for the most part
- This project uses the project structure from discord's [tutorial on how to make your own discord bot](https://docs.discord.com/developers/quick-start/getting-started), click [here](https://github.com/discord/discord-example-app) if you just want the sample repo
	- Follow this tutorial to set up your own discord bot if you're unsure
- This project is set up to work with my [discord message scraper](https://github.com/Plantero0821/discord-message-scraper)
	- It's set up so you can just copy the data.json files as well as the messageFolder output folder into this project 
		- In data.json, you might still need to configure the servers and their webhooks using the structure given in the sample, since those are not used in the scraper
	- In case you get your messages elsewhere, the requirement are as follows: 
		- Under the configured messageFolder, one folder for each user with its name in the format \<userID>\_\<whatever>
		- In each user folder: exclusively json-files containing an array of messages, all files present are read for the folder user ID
- This project uses webhooks to send the pretend messages, since you can give those a custom name and profile picture for every message
	- Webhooks are bound to a single channel, so create a new webhook for every channel you want to use the bot in
	- Go to server settings -> Integrations -> Webhooks -> New Webhook:
 
 <img width="667" height="299" alt="Webhook" src="https://github.com/user-attachments/assets/aa2d3029-bbeb-4aa1-9eb3-c3bc98caa37a" />
