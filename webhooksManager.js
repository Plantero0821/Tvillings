import serverData from './data.json' with {type: "json"}
import http from 'node:https'
import { DiscordRequest } from './utils.js';


export class WebhooksManager {
    userData = {};

    constructor() {
        for (const user of serverData.users) {
            DiscordRequest(`users/${user.id}`, { method: 'GET' })
            .then(async(fetchedData) => {
                let fetchedJson = await fetchedData.json();
                this.userData[user.id] = {};
                this.userData[user.id].name = fetchedJson.global_name;
                this.userData[user.id].avatar = `https://cdn.discordapp.com/avatars/${user.id}/${fetchedJson.avatar}.webp?size=80`
            })
        }
    }

    async sendMessage(serverID, channelID, user, message) {
        try {
            const url = serverData.servers.find(x => x.id == serverID).webhookLinks.find(x => x.id == channelID).link;
            const options = {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(
                    {
                        "content": message,
                        "username": this.userData[user].name,
                        "avatar_url": this.userData[user].avatar
                    }
                )
            };

            const response = await fetch(url, options);
        } catch (error) {
            console.error(error);
        }
    }
}