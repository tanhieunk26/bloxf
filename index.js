import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

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

// Đăng nhập bot Discord
client.login(process.env.BOT_TOKEN).then(() => {
  console.log("Discord bot logged in!");
});

export default async function handler(req, res) {
  try {
    const data = {};

    for (const channelId of channelIds) {
      const channel = await client.channels.fetch(channelId);
      const messages = await channel.messages.fetch({ limit: 3 });

      const embedMessages = messages.filter(msg => msg.embeds.length > 0);

      data[channelId] = embedMessages.map(msg => {
        return msg.embeds.map(embed => ({
          jobId: msg.id,
          scriptId: msg.author.id,
          title: embed.title || 'No Title',
          description: embed.description || 'No Description',
          color: embed.color,
          author: embed.author ? embed.author.name : 'No Author',
          image: embed.image ? embed.image.url : 'No Image',
          footer: embed.footer ? embed.footer.text : 'No Footer',
          timestamp: embed.timestamp,
          fields: embed.fields.map(field => ({
            name: field.name,
            value: field.value,
          })),
        }));
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch channel data' });
  }
}
