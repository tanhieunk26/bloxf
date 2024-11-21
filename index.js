const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path'); // Thêm thư viện path để xử lý đường dẫn
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Đảm bảo tệp HTML được phục vụ
app.use(express.static(path.join(__dirname, 'public')));  // Thêm dòng này để phục vụ tệp HTML từ thư mục 'public'

// Danh sách các Channel ID mà bạn muốn lấy tin nhắn
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

// API lấy tất cả thông tin tin nhắn trả lời nhúng
app.get('/api/channels', async (req, res) => {
  try {
    const data = {};

    // Lặp qua các kênh và lấy dữ liệu tin nhắn trả lời nhúng
    for (const channelId of channelIds) {
      const channel = await client.channels.fetch(channelId);
      const messages = await channel.messages.fetch({ limit: 3 });

      // Lọc các tin nhắn có embeds
      const embedMessages = messages.filter(msg => msg.embeds.length > 0);

      // Lưu thông tin tin nhắn trả lời nhúng theo tên kênh
      data[channelId] = embedMessages.map(msg => {
        const embeds = msg.embeds.map(embed => ({
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

        return embeds;
      });
    }

    // Trả về dữ liệu phân chia theo channelId
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch channel data' });
  }
});

// Đăng nhập bot Discord
client.login(process.env.BOT_TOKEN).then(() => {
  console.log("Discord bot logged in!");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
