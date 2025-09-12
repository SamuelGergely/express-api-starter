// Pizza/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pizzas API',
            version: '1.0.0',
            description: 'RESTful API for product management (SQLite, Express).'
        },
        servers: [
            { url: 'http://localhost:4000', description: 'Local dev server' }
        ]
    },
    apis: ['./Pizza/routes/*.js', './Pizza/controllers/*.js'] // pick up JSDoc in routes/controllers
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
