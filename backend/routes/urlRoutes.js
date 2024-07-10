import express from 'express';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';

config();

const router = express.Router();

import { getUrls } from '../controllers/urlsController.js';

router.get('/', getUrls);

router.post('/', (req, res) => {
  res.status(200).json({ message: 'Set Url' });
});
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update Url ${req.params.id}` });
});

const supabaseAdmin = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const fetchMusicData = async (req, res, channelId) => {
  const { data, error } = await supabaseAdmin
    .from('music')
    .select('*')
    .eq('channel_id', channelId);
  if (error) {
    return res.status(500).json({ error: 'Error fetching data from Supabase' });
  }
  res.status(200).json({ data });
};

router.get('/allhop', async (req, res) => {
  fetchMusicData(req, res, '1049841438919245925');
});

router.get('/allgems', async (req, res) => {
  fetchMusicData(req, res, '1057747211468943450');
});

router.get('/allregga', async (req, res) => {
  fetchMusicData(req, res, '1071400000216641566');
});

router.get('/allturntable', async (req, res) => {
  fetchMusicData(req, res, '1062327975091126342');
});

router.get('/alldnb', async (req, res) => {
  fetchMusicData(req, res, '1062325992137424986');
});

router.get('/allhouse', async (req, res) => {
  fetchMusicData(req, res, '1062325851418525776');
});

router.get('/allbeat', async (req, res) => {
  fetchMusicData(req, res, '1062329322477727764');
});

router.get('/allmusic', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('music').select('*');
  if (error) {
    return res.status(500).json({ error: 'Error fetching data from Supabase' });
  }
  res.status(200).json({ data });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete Url ${req.params.id}` });
});

router.get('/allMessages', (req, res) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  const token = process.env.DISCORD_BOT_TOKEN;
  const apiKey = process.env.YOUTUBE_API_KEY;

  const channelIds = [
    '1057747211468943450',
    '1049841438919245925',
    '1062329322477727764',
    '1062325851418525776',
    '1062325992137424986',
    '1062327975091126342',
    '1071400000216641566',
    '1090337461764358175',
  ];

  const processedVideos = new Set();

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    channelIds.forEach((channelId) => {
      const channel = client.channels.cache.get(channelId);

      if (!channel) {
        console.error(`Channel with ID ${channelId} not found.`);
        return;
      }

      let allMessages = [];
      let lastMessageId;
      const fetchMessages = () => {
        channel.messages
          .fetch({ limit: 100, before: lastMessageId })
          .then(async (messages) => {
            console.log(
              `Fetched ${messages.size} messages from channel ${channelId}`
            );
            allMessages = allMessages.concat(messages);
            if (messages && messages.size > 0) {
              lastMessageId = messages.last().id;
            }
            if (messages.size === 100) {
              fetchMessages();
            } else {
              console.log(
                `Finished fetching messages from channel ${channelId}`
              );
            }

            const youtubeMessages = messages.filter((message) =>
              message.content.includes('youtu')
            );

            for (const message of youtubeMessages.values()) {
              const { data, error } = await supabaseAdmin
                .from('music')
                .select('*')
                .order('id');
              if (error) {
                console.error('Error fetching existing video IDs:', error);
                continue;
              }
              const existingVideoIds = data.map(
                (videoData) => videoData.video_id
              );

              const match = message.content.match(/https?:\/\/[^\s]+/);
              if (match) {
                const url = match[0];
                console.log(`Processing URL: ${url}`);
                const urlRegex =
                  /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                const videoId = url.match(urlRegex);

                if (videoId && videoId[1].length === 11) {
                  const channelId = message.channel.id;
                  const username = message.author.username;
                  const timestamp = message.createdTimestamp;
                  const messageTimestamp = new Date(timestamp);

                  const thumbnailUrl = `https://img.youtube.com/vi/${videoId[1]}/default.jpg`;

                  try {
                    const response = await fetch(
                      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId[1]}&key=${apiKey}`
                    );
                    const info = await response.json();

                    if (
                      !existingVideoIds.includes(videoId[1]) &&
                      !processedVideos.has(videoId[1])
                    ) {
                      processedVideos.add(videoId[1]);

                      if (
                        info.items &&
                        info.items[0] &&
                        info.items[0].snippet
                      ) {
                        const { error } = await supabaseAdmin
                          .from('music')
                          .insert([
                            {
                              title: info.items[0].snippet.title,
                              url: url,
                              video_id: videoId[1],
                              channel_id: channelId,
                              username: username,
                              thumb: thumbnailUrl,
                              message_timestamp: messageTimestamp,
                            },
                          ]);

                        if (error) {
                          console.error(
                            'Error inserting data into Supabase:',
                            error
                          );
                        } else {
                          console.log(
                            `Successfully added video ${videoId[1]} to the database`
                          );
                        }
                      } else {
                        console.error(
                          'Unable to retrieve snippet information from the YouTube API'
                        );
                        console.log(
                          `YouTube API response: ${JSON.stringify(info)}`
                        );
                      }
                    }
                  } catch (error) {
                    console.error(
                      `Error retrieving information from the YouTube API: ${error}`
                    );
                  }
                } else {
                  console.error('Invalid video ID extracted from URL', videoId);
                }
              } else {
                console.error(
                  'No URL found in message content',
                  message.content
                );
              }
            }
          })
          .catch((error) => {
            console.error(
              `Error fetching messages from channel ${channelId}: ${error}`
            );
          });
      };
      fetchMessages();
    });
  });

  client.login(token);

  res.status(200).json({ message: `Fetched all messages` });
});

export default router;
