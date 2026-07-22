import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { MarkovGenerator } from './markov.js';
import { WebhooksManager } from './webhooksManager.js';
import serverData from './data.json' with {type:'json'};

const messageGenerators = getMessageGenerators();
const webhooksManager = new WebhooksManager();

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function haveConversation(serverID, channelID, conversationRounds, roundLength, maxMessageLength, messageInterval) {
  const order = [];
  let fixedNumOfConversationRounds = false;
  if (conversationRounds > 1000) {
    conversationRounds -= 1000;
    fixedNumOfConversationRounds = true;
  }

  // Generate speakingRounds rounds of conversation
  // Each person says a maximum of roundLength messages per round
  const persons = Object.keys(messageGenerators);
  let lastPickedPerson;
  //Make sure there are at least two rounds of conversation so it's an actual conversation
  for (let i = 0; i < (fixedNumOfConversationRounds ? conversationRounds : (2 + Math.floor(Math.random() * (conversationRounds - 2)))); i++) {
	// Ensure speaker changes per round of conversation
    let pickedPerson;
    do {
      pickedPerson = persons[Math.floor(persons.length * Math.random())];
    } while (pickedPerson == lastPickedPerson);
    lastPickedPerson = pickedPerson;

    //Make sure they say at least one thing per round
    for (let j = 0; j < (1 + Math.floor(Math.random() * (roundLength - 1))); j++) {
      order.push(pickedPerson);
    }
  }

  // console.log(order);

  // Each person says a maximum of maxMessageLength words per message
  // There is a delay of at least messageInterval milliseconds per message
  let time = Date.now();
  for (const speaker of order) {
    await webhooksManager.sendMessage(serverID, channelID, speaker, messageGenerators[speaker].getMessage(Math.floor(Math.random() * maxMessageLength)));
    let timePassed = Date.now() - time;
    let timeToWait = Math.max(messageInterval - timePassed, 0);
    // console.log("waiting for " + timeToWait.toString() + "ms");
    await new Promise((r) => setTimeout(() => r(), timeToWait));
    time = Date.now();
  }
}

function getMessageGenerators() {
  let generators = {};
  
  let dirs = fs.readdirSync(serverData.messageFolder);
  for (const dir of dirs) {
    let messages = [];
    const files = fs.readdirSync(path.join(serverData.messageFolder, dir));
    for (const file of files) {
      messages.push(...JSON.parse(fs.readFileSync(path.join(serverData.messageFolder, dir, file))));
    }
    generators[dir.split('_')[0]] = new MarkovGenerator(messages);
  }
  
  return generators;
}