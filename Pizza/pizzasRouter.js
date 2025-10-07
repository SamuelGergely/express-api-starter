// Pizza/routes/pizzasRouter.js
const express = require('express');
const { body, param } = require('express-validator');
const pizzaController = require('./pizzaController');

const routerPizza = express.Router();

/**
 * @openapi
 * /api/pizzas:
 *   get:
 *     summary: Retrieve a list of pizzas
 *     responses:
 *       200:
 *         description: A list of pizzas
 *   post:
 *     summary: Create a new pizza
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
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               ingredients:
 *                  type: array
 *                  items:
 *                      type: integer
 *     responses:
 *       201:
 *         description: Pizza created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/pizzas/{id}:
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
 *         description: A single pizza
 *       404:
 *         description: Pizza not found
 *   put:
 *     summary: Update a pizza by ID
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
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               ingredients:
 *                  type: array
 *                  items:
 *                      type: integer
 *     responses:
 *       200:
 *         description: Pizza updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Pizza not found
 *   delete:
 *     summary: Delete a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pizza deleted
 *       404:
 *         description: Pizza not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('description').optional().isString(),
    body('imageUrl').optional().isString().isURL().withMessage('imageUrl must be a valid URL'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

routerPizza.get('/', pizzaController.findAll);
routerPizza.post('/', createAndUpdateValidations, pizzaController.create);
routerPizza.get('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.findOne);
routerPizza.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], pizzaController.update);
routerPizza.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.delete);

routerPizza.post(
    '/:id/ingredients/:ingredientId',
    [
      param('pizzaId').isInt().withMessage('pizzaId must be an integer'),
      param('ingredientId').isInt().withMessage('ingredientId must be an integer')
    ],
    pizzaController.addIngredient);

routerPizza.get(
    '/:pizzaId/ingredients',
    [
        param('pizzaId').isInt().withMessage('pizzaId must be an integer')
    ],
    pizzaController.getIngredient
);

routerPizza.delete(
    '/:id/ingredients/:ingredientId',
    [
        param('pizzaId').isInt().withMessage('pizzaId must be an integer'),
        param('ingredientId').isInt().withMessage('ingredientId must be an integer')
    ],
    pizzaController.removeIngredient);

module.exports = routerPizza;
