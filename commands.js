import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Simple test command
const CONVERSATION_COMMAND = {
  name: 'conversation',
  description: 'Let them talk!',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      name: "conversation_rounds",
      description: "How many rounds of conversation there are going to be. Default is between 2 and 10.",
      type: 4,
      required: false,
      min_value: 1,
      max_value: 20
    },
    {
      name: "round_length",
      description: "How many messages a speaker can say at maximum. Default is 5.",
      type: 4,
      required: false,
      min_value: 1,
      max_value: 20
    },
    {
      name: "max_message_length",
      description: "How many words each message can have at maximum. Default is 15.",
      type: 4,
      required: false,
      min_value: 1
    },
    {
      name: "message_interval",
      description: "Wait time between messages in milliseconds. Default is 2500",
      type: 4,
      required: false,
      min_value: 500,
      max_value: 10000
    }
  ]
};

const ALL_COMMANDS = [CONVERSATION_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
