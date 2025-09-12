// Ingredient/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ingredients API',
            version: '1.0.0',
            description: 'RESTful API for product management (SQLite, Express).'
        },
        servers: [
            { url: 'http://localhost:4000', description: 'Local dev server' }
        ]
    },
    apis: ['./Ingredient/routes/*.js', './Ingredient/routes/*.js'] // pick up JSDoc in routes/controllers
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;