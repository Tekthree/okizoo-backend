const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const { getUrls } = require('../controllers/urlsController.js');
const { createClient } = require('@supabase/supabase-js');
const { Client, GatewayIntentBits } = require('discord.js'); // Import the Discord library

router.get('/', getUrls);

router.post('/', (req, res) => {
  res.status(200).json({ message: 'Set Url' });
});
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update Url ${req.params.id}` });
});

router.get('/allhop', async (req, res) => {
  const supabaseAdmin = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabaseAdmin
    .from('music')
    .select('*')
    .eq('channel_id', '1049841438919245925');

  res.status(200).json({ data });
});

router.get('/allgems', async (req, res) => {
  const supabaseAdmin = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabaseAdmin
    .from('music')
    .select('*')
    .eq('channel_id', '1057747211468943450');

  res.status(200).json({ data });
});

router.get('/allregga', async (req, res) => {
  const supabaseAdmin = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabaseAdmin
    .from('music')
    .select('*')
    .eq('channel_id', '1071400000216641566');

  res.status(200).json({ data });
});

router.get('/allturntable', async (req, res) => {
  const supabaseAdmin = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabaseAdmin
    .from('music')
    .select('*')
    .eq('channel_id', '1062327975091126342');

  res.status(200).json({ data });
});

router.get('/alldnb', async (req, res) => {
  const supabaseAdmin = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabaseAdmin
    .from('music')
    .select('*')
    .eq('channel_id', '1062325992137424986');

  res.status(200).json({ data });
});

router.get('/allhouse', async (req, res) => {
  const supabaseAdmin = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabaseAdmin
    .from('music')
    .select('*')
    .eq('channel_id', '1062325851418525776');

  res.status(200).json({ data });
});

router.get('/allbeat', async (req, res) => {
  const supabaseAdmin = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabaseAdmin
    .from('music')
    .select('*')
    .eq('channel_id', '1062329322477727764');

  res.status(200).json({ data });
});

router.get('/allmusic', async (req, res) => {
  const supabaseAdmin = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabaseAdmin.from('music').select('*');

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
  }); // Create a new Discord client

  const token = process.env.DISCORD_BOT_TOKEN;
  const apiKey = process.env.YOUTUBE_API_KEY;

  const supabaseAdmin = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const channelIds = [
    '1057747211468943450',
    '1049841438919245925',
    '1062329322477727764',
    '1062325851418525776',
    '1062325992137424986',
    '1062327975091126342',
    '1071400000216641566',
  ];

  const processedVideos = new Set();

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    channelIds.forEach((channelId) => {
      const channel = client.channels.cache.get(channelId);

      let allMessages = [];
      let lastMessageId;
      const fetchMessages = () => {
        channel.messages
          .fetch({ limit: 100, before: lastMessageId })
          .then((messages) => {
            allMessages = allMessages.concat(messages);
            if (messages && messages.size > 0) {
              lastMessageId = messages.last().id;
            }
            if (messages.size === 100) {
              fetchMessages();
            } else {
            }

            const youtubeMessages = messages.filter((message) => {
              return message.content.includes('youtu');
            });

            let youtubeVideos = [];

            youtubeMessages.forEach(async (message) => {
              const { data } = await supabaseAdmin
                .from('music')
                .select('*')
                .order('id');

              const existingVideoIds = data.map(
                (videoData) => videoData.video_id
              );

              const match = message.content.match(/https?:\/\/[^\s]+/);
              if (match) {
                const url = match[0];
                const urlRegex =
                  /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                const videoId = url.match(urlRegex);

                console.log('videoId before', videoId);

                if (videoId && videoId[1].length === 11) {
                  const channelId = message.channel.id;
                  const username = message.author.username;
                  const timestamp = message.createdTimestamp;
                  const messageTimestamp = new Date(timestamp);

                  var thumbnailUrl =
                    'https://img.youtube.com/vi/' + videoId[1] + '/default.jpg';

                  const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId[1]}&key=${apiKey}`
                  ).catch((error) => {
                    console.error(
                      `Error retrieving information from the YouTube API: ${error}`
                    );
                  });
                  const info = await response.json();

                  if (
                    !existingVideoIds.includes(videoId[1]) &&
                    !processedVideos.has(videoId[1])
                  ) {
                    processedVideos.add(videoId[1]);

                    if (info.items && info.items[0] && info.items[0].snippet) {
                      await supabaseAdmin.from('music').insert([
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

                      youtubeVideos.push({
                        title: info.items[0].snippet.title,
                        url,
                        id: videoId[1],
                        channelId,
                        username,
                        thumb: thumbnailUrl,
                        messageTimestamp,
                      });
                    } else {
                      console.error(
                        'Unable to retrieve snippet information from the YouTube API'
                      );
                    }
                  }
                }
              } else {
                console.error('No URL found in message content');
              }
              console.log(youtubeVideos);
            });
          });
      };
      fetchMessages();
    });
  });

  client.login(token);

  res.status(200).json({ message: `got all messgaes` });
});

module.exports = router;
