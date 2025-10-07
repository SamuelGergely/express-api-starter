// routes/router.js
const express = require('express');
const pizzasRouter = require('../ms-pizzas/src/routes/pizzasRouter');
const ingredientsRouter = require('../ms-ingredients/src/routes/ingredientsRouter');

const router = express.Router();

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter);

module.exports = router;
