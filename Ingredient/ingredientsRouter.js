// Ingredient/routes/ingredientsRouter.js
const express = require('express');
const { body, param } = require('express-validator');
const ingredientController = require('./ingredientController');

const routerIngredient = express.Router();

/**
 * @openapi
 * /api/ingredients:
 *   get:
 *     summary: Retrieve a list of products
 *     responses:
 *       200:
 *         description: A list of products
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ingredient created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/ingredients/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ingredient updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Ingredient deleted
 *       404:
 *         description: Ingredient not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

routerIngredient.get('/', ingredientController.findAll);
routerIngredient.post('/', createAndUpdateValidations, ingredientController.create);
routerIngredient.get('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.findOne);
routerIngredient.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], ingredientController.update);
routerIngredient.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.delete);

module.exports = routerIngredient;