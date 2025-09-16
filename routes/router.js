// routes/router.js
const express = require('express');
const pizzasRouter = require('../Pizza/pizzasRouter');
const ingredientsRouter = require('../Ingredient/ingredientsRouter');

const router = express.Router();

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter);

module.exports = router;
