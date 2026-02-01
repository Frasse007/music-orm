const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

// Initialize Sequelize with SQLite
const db = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || './database/music_library.db',
    logging: console.log
});

// Async function to initialize database and tables
async function setupDatabase() {
    try {
        // Tests connection
        await db.authenticate();
        console.log('Connection to database successfully established.');

        // Sync models (Track model)
        await db.sync({ force: true })
        console.log('Database file created at:', `/database/${process.env.DB_NAME}`);

        // Closes connection
        await db.close();
        console.log('Database connection closed')
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Defines/Outlines Track model
const Track = db.define('Track', {
    trackId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    songTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    albumName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1
        }
    },
    releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            max: new Date().getFullYear()
        }
    }
}, {
    tableName: 'tracks',
    timestamps: true
});


// Only run setup if this file is directly executed
if (require.main === module) {
    setupDatabase();
}

// Export database instance and Track model
module.exports = { db, Track };