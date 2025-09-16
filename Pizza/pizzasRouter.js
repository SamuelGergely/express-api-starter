// Pizza/routes/pizzasRouter.js
const express = require('express');
const { body, param } = require('express-validator');
const pizzaController = require('./pizzaController');

const routerPizza = express.Router();

/**
 * @openapi
 * /api/pizzas:
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
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
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
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
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

module.exports = routerPizza;
