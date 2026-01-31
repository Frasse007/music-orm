# Assignment #7: Music Library API

A RESTful API for managing a music library built with Node.js, Express.js, and Sequelize ORM using SQLite database.

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Set up the database:
   ```bash
   node database/setup.js
   ```

5. Seed the database with sample data:
   ```bash
   node database/seed.js
   ```

6. Start the server:
   ```bash
   node server.js
   ```

## API Endpoints

### Get All Tracks
- **GET** `/api/tracks`
- Returns all tracks in the database

### Get Track by ID
- **GET** `/api/tracks/:id`
- Returns a specific track by ID

### Create New Track
- **POST** `/api/tracks`
- Creates a new track
- **Body:**
  ```json
  {
    "songTitle": "Song Title",
    "artistName": "Artist Name",
    "albumName": "Album Name",
    "genre": "Genre",
    "duration": 180,
    "releaseYear": 2024
  }
  ```

### Update Track
- **PUT** `/api/tracks/:id`
- Updates an existing track
- **Body:** Same as create track

### Delete Track
- **DELETE** `/api/tracks/:id`
- Deletes a track by ID

## Database Schema

The `tracks` table contains the following fields:

- `trackId` (INTEGER, Primary Key, Auto Increment)
- `songTitle` (STRING, Required)
- `artistName` (STRING, Required)
- `albumName` (STRING, Required)
- `genre` (STRING, Required)
- `duration` (INTEGER, Required) - Duration in seconds
- `releaseYear` (INTEGER, Required)

## Project Structure

```
music-library-api/
├── database/
│   ├── setup.js    # Database setup and model definitions
│   └── seed.js     # Sample data seeding
├── server.js       # Main server file with API routes
├── package.json
├── .env            # Environment variables
├── .gitignore
└── README.md
```