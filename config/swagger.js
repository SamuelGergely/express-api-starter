// Pizza/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pizzas API',
            version: '2.0.0',
            description: 'RESTful API for product management (SQLite, Express).'
        },
        servers: [
            { url: 'http://localhost:4000', description: 'Local dev server' }
        ]
    },
    apis: [
        path.join(__dirname,'../Pizza/pizzasRouter.js'),
        path.join(__dirname,'../Pizza/pizzaController.js'),
        path.join(__dirname, '../Ingredient/ingredientsRouter.js'),
        path.join(__dirname,'../Ingredient/ingredientController.js')
    ] // pick up JSDoc in routes/controllers
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
