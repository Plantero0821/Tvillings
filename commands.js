import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Simple test command
const CONVERSATION_COMMAND = {
  name: 'conversation',
  description: 'Let them talk!',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ALL_COMMANDS = [CONVERSATION_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
