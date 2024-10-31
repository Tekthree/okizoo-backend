import express from 'express';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';

config();

const router = express.Router();

// Constants
const CHANNEL_IDS = {
  hop: '1049841438919245925',
  gems: '1057747211468943450',
  regga: '1071400000216641566',
  turntable: '1062327975091126342',
  dnb: '1062325992137424986',
  house: '1062325851418525776',
  beat: '1062329322477727764',
};

const YOUTUBE_URL_REGEX =
  /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const MESSAGE_FETCH_LIMIT = 100;

// Initialize Supabase client
const supabaseAdmin = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper Functions
const fetchFromSupabase = async (channelId = null) => {
  const query = supabaseAdmin.from('videos').select('*');
  if (channelId) {
    query.eq('channel_id', channelId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const getYouTubeVideoInfo = async (videoId) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
  );
  return response.json();
};

const insertVideoToSupabase = async (videoData) => {
  const { error } = await supabaseAdmin.from('videos').insert([videoData]);
  if (error) throw error;
};

// Route Handlers
const handleChannelFetch = async (req, res, channelId) => {
  try {
    const data = await fetchFromSupabase(channelId);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Supabase' });
  }
};

// Discord Message Processing
const processDiscordMessages = async (
  channel,
  processedVideos,
  existingVideoIds
) => {
  let allMessages = [];
  let lastMessageId;

  const processMessage = async (message) => {
    if (!message.content.includes('youtu')) return;

    const urlMatch = message.content.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) return;

    const videoIdMatch = urlMatch[0].match(YOUTUBE_URL_REGEX);
    if (!videoIdMatch || videoIdMatch[1].length !== 11) return;

    const videoId = videoIdMatch[1];
    if (existingVideoIds.includes(videoId) || processedVideos.has(videoId))
      return;

    processedVideos.add(videoId);

    try {
      const info = await getYouTubeVideoInfo(videoId);
      if (!info.items?.[0]?.snippet) return;

      await insertVideoToSupabase({
        title: info.items[0].snippet.title,
        url: urlMatch[0],
        video_id: videoId,
        channel_id: message.channel.id,
        username: message.author.username,
        thumb: `https://img.youtube.com/vi/${videoId}/default.jpg`,
        message_timestamp: new Date(message.createdTimestamp),
        is_active: true,
        view_count: 0,
        heart_count: 0,
      });
    } catch (error) {
      console.error(`Error processing video ${videoId}:`, error);
    }
  };

  const fetchMessages = async () => {
    try {
      const messages = await channel.messages.fetch({
        limit: MESSAGE_FETCH_LIMIT,
        before: lastMessageId,
      });

      if (messages.size > 0) {
        allMessages = allMessages.concat(messages);
        lastMessageId = messages.last().id;

        await Promise.all(Array.from(messages.values()).map(processMessage));

        if (messages.size === MESSAGE_FETCH_LIMIT) {
          await fetchMessages();
        }
      }
    } catch (error) {
      console.error(
        `Error fetching messages from channel ${channel.id}:`,
        error
      );
    }
  };

  await fetchMessages();
  return allMessages;
};

// Routes
router.get('/', (req, res) => res.status(200).json({ message: 'Music API' }));

// Channel-specific routes
Object.entries(CHANNEL_IDS).forEach(([genre, channelId]) => {
  router.get(`/all${genre.toLowerCase()}`, (req, res) =>
    handleChannelFetch(req, res, channelId)
  );
});

router.get('/allmusic', async (req, res) => {
  try {
    const data = await fetchFromSupabase();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Supabase' });
  }
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

  const processedVideos = new Set();

  client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    try {
      const { data: existingVideos } = await supabaseAdmin
        .from('videos')
        .select('video_id');

      const existingVideoIds = existingVideos.map((v) => v.video_id);

      await Promise.all(
        Object.values(CHANNEL_IDS).map(async (channelId) => {
          const channel = client.channels.cache.get(channelId);
          if (!channel) {
            console.error(`Channel with ID ${channelId} not found.`);
            return;
          }
          await processDiscordMessages(
            channel,
            processedVideos,
            existingVideoIds
          );
        })
      );
    } catch (error) {
      console.error('Error processing channels:', error);
    }
  });

  client.login(process.env.DISCORD_BOT_TOKEN);
  res.status(200).json({ message: 'Started message processing' });
});

export default router;
