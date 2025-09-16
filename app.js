// app.js
const express = require('express');
const morgan = require('morgan');
const router = require('./routes/router');
const swaggerPizzaUi = require('swagger-ui-express');
const swaggerPizzaSpec = require('./config/swagger');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// API routes
app.use('/api', router);

// Swagger Ingredient UI
app.use('/docs', swaggerPizzaUi.serve, swaggerPizzaUi.setup(swaggerPizzaSpec));
app.get('/docs/pizza/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerPizzaSpec);
})

// basic health-check
app.get('/', (req, res) => res.json({ status: 'ok' }));

// error handler (fallback)
app.use((err, req, res, next) => {
    console.error(err);
    if (!res.headersSent) {
        res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    } else next(err);
});

module.exports = app;
