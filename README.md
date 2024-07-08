# Discord Music Bot Backend API

This is a backend API for a music-related Discord bot and web application. It fetches music data from various Discord channels, stores it in a Supabase database, and provides endpoints to access this data.

## Features

- Fetch music data from specific Discord channels
- Store and retrieve music information from a Supabase database
- Interact with the YouTube API to get video details
- Provide endpoints to access music data for different genres or channels

## Technologies Used

- Node.js
- Express.js
- Supabase
- Discord.js
- YouTube Data API

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version 12.x or later recommended)
- A Supabase account and project set up
- A Discord bot token
- A YouTube Data API key

## Installation

1. Clone the repository:
   git clone https://github.com/yourusername/discord-music-bot-api.git

2. Navigate to the project directory:cd discord-music-bot-api

3. Install the dependencies: npm install

## Configuration

1. Create a `.env` file in the root directory
2. Add the following environment variables:

## Running the API

To run the API, use the following command: npm start

The server will start running at `http://localhost:8000` (or the port you specified in the .env file).

## API Endpoints

- `GET /api/urls/allhop`: Fetch music data from the Hip Hop channel
- `GET /api/urls/allgems`: Fetch music data from the Gems channel
- `GET /api/urls/allregga`: Fetch music data from the Reggae channel
- `GET /api/urls/allturntable`: Fetch music data from the Turntable channel
- `GET /api/urls/alldnb`: Fetch music data from the Drum and Bass channel
- `GET /api/urls/allhouse`: Fetch music data from the House channel
- `GET /api/urls/allbeat`: Fetch music data from the Beat channel
- `GET /api/urls/allmusic`: Fetch all music data
- `GET /api/urls/allMessages`: Process and store new messages from specified Discord channels

## Discord Bot Functionality

The Discord bot listens to specified channels, processes YouTube links shared in these channels, and stores the information in the Supabase database. It extracts video details using the YouTube Data API.

## Contributing

Contributions to the Discord Music Bot Backend API are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the original branch: `git push origin feature-branch-name`
5. Create a pull request

## Contact

If you have any questions or feedback, please contact Tek Jones at [tekthree+github@gmail.com].
