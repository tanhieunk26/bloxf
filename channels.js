const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Danh sách các Channel ID
const channelIds = [
  "1300298976951795843",
  "1300298978008760375",
  "1300298979212529696",
  "1300298981342974014",
  "1300298982605459498",
  "1302946520680628234",
  "1302946350119387168",
  "1302946473629188149",
  "1302946569137688606",
  "1302946630189842482",
  "1302946693335093299",
  "1300298984350547990",
  "1300298985449197630",
  "1300298986246246413",
  "1300298987475304480",
  "1300298989916127294",
  // ... Thêm các Channel ID khác ở đây
];

// Endpoint chính
app.get('/api/channels', async (req, res) => {
  try {
    const data = {};

    for (const channelId of channelIds) {
      const channel = await client.channels.fetch(channelId);
      const messages = await channel.messages.fetch({ limit: 3 });

      const embedMessages = messages.filter(msg => msg.embeds.length > 0);
      data[channelId] = embedMessages.map(msg => {
        return msg.embeds.map(embed => ({
          title: embed.title || 'No Title',
          description: embed.description || 'No Description',
        }));
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch channel data' });
  }
});

// Đăng nhập bot Discord
client.login(process.env.BOT_TOKEN).then(() => {
  console.log("Discord bot logged in!");
});

// Xuất app để Vercel xử lý
module.exports = app;
