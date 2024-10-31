# Zoo-tube Backend API

## Overview

Backend service for Zoo-tube - a real-time music discovery platform that connects Discord communities with music enthusiasts. The service processes YouTube links shared in Discord channels, manages user interactions, and provides real-time data synchronization.

## 🚀 Features

- Discord message processing and YouTube link extraction
- Genre-based music categorization
- API endpoints for music discovery

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Discord.js** - Discord bot integration
- **Supabase** - Database and authentication
- **YouTube Data API** - Video information fetching

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm/yarn
- Discord Bot Token
- Supabase Account
- YouTube API Key

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
DISCORD_BOT_TOKEN=your_discord_bot_token
PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
YOUTUBE_API_KEY=your_youtube_api_key
```

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/okizoo-backend.git
cd okizoo-backend
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

## 📚 API Endpoints

### Music Endpoints

- `GET /api/urls/allmusic` - Fetch all music tracks
- `GET /api/urls/allhop` - Fetch Hip-Hop tracks
- `GET /api/urls/allgems` - Fetch Gems collection
- `GET /api/urls/allregga` - Fetch Reggae tracks
- `GET /api/urls/allturntable` - Fetch Turntablism tracks
- `GET /api/urls/alldnb` - Fetch Drum & Bass tracks
- `GET /api/urls/allhouse` - Fetch House tracks
- `GET /api/urls/allbeat` - Fetch Beat tracks

## 📁 Project Structure

```
backend/
├── routes/           # API route definitions
├── controllers/      # Request handlers
```

## Discord Bot Functionality

The Discord bot listens to specified channels, processes YouTube links shared in these channels, and stores the information in the Supabase database. It extracts video details using the YouTube Data API.

## 🎯 Upcoming Features

- code refactoring
- Real-time radio synchronization
- Live chat system
- Multiple radio channels
- Enhanced analytics
- User playlists

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Tek Jones - tekthree@gmail.com

Project Link: [https://github.com/Tekthree/okizoo-backend](https://github.com/Tekthree/okizoo-backend)
