const express = require('express');
const { db, Track } = require('./database/setup.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Tests connection to database before starting server
async function testConnection() {
    try {
        await db.authenticate();
        console.log('Connection to database successfully established');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
testConnection();

// GET /api/tracks - Gets all tracks
app.get('/api/tracks', async (req, res) => {
    try {
        const tracks = await Track.findAll();
        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: 'Failed to fetch tracks' });
    }
});

// GET /api/tracks/:id - Gets a track by ID
app.get('/api/tracks/:id', async (req, res) => {
    try {
        const track = await Track.findByPk(req.params.id);

        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }
        res.status(200).json(track);
    } catch (error) {
        console.error('Error fetching track:', error);
        res.status(500).json({ error: 'Failed to fetch track' });
    }
});

// POST /api/tracks - Creates new track
app.post('/api/tracks', async (req, res) => {
    try {
        const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

        // Validate required fields
        if (!songTitle || !artistName || !albumName || !genre || !duration || !releaseYear) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate data types
        if (typeof duration !== 'number' || duration <= 0) {
            return res.status(400).json({ error: 'Duration must be a positive number' });
        }

        if (typeof releaseYear !== 'number' || releaseYear > new Date().getFullYear()) {
            return res.status(400).json({ error: 'Release year must be a valid year'});
        }

        const newTrack = await Track.create({
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        });

        res.status(201).json(newTrack);
    } catch (error) {
        console.error('Error creating track:', error);
        res.status(500).json({ error: 'Error creating track' });
    }
});

// PUT /api/tracks/:id - Updates track by ID
app.put('/api/tracks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

        // Validate input if provided
        if (duration !== undefined && (typeof duration !== 'number' || duration <= 0)) {
            return res.status(400).json({ error: 'Duration must be a positive number' });
        }

        if (releaseYear !== undefined && (typeof releaseYear !== 'number' || releaseYear > new Date().getFullYear())) {
            return res.status(400).json({ error: 'Release year must be a valid year'});
        }

        // Update track
        const [updatedRowsCount] = await Track.update(
            { songTitle, artistName, albumName, genre, duration, releaseYear },
            { where: { trackId: id } }
        );

        // Check if track exists and is updated
        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: `Track with id: ${id} not found` });
        }
        // Fetch updated track
        const updatedTrack = await Track.findByPk(id);
        res.status(200).json(updatedTrack);
    } catch (error) {
        console.error('Error updating track:', error);
        res.status(500).json({ error: 'Error updating track' });
    }
});

// DELETE /api/tracks/:id - Deletes a track by ID
app.delete('/api/tracks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Deletes track
        const deletedCount = await Track.destroy({ where: { trackId: id } });
        
        // Checks if track was deleted
        if (deletedCount === 0) {
            return res.status(404).json({ error: `Track with id: ${id} not found` });
        }
        res.status(200).json({ message: 'Track deleted successfully' });
    } catch (error) {
        console.error('Error deleting track', error);
        res.status(500).json({ error: 'Error deleting track' });
    }
});

// Starts the Express server on the specified port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});