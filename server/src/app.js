const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const postRoutes = require('./routes/posts');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev')); // Logging
    app.use(logger); // Custom logging
}

// Routes
app.use('/api/posts', postRoutes);

// Global Error Handler (Debugging requirement)
app.use(errorHandler);

module.exports = app;