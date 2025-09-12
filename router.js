// routes/router.js
const express = require('express');
const pizzasRouter = require('./Pizza/routes/pizzas');
const ingredientsRouter = require('./Ingredient/routes/ingredients');

const router = express.Router();

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter);

module.exports = router;
