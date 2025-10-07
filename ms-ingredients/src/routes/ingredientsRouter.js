// routes/routes/ingredientsRouter.js
const express = require("express");
const { body, param } = require("express-validator");
const ingredientController = require("../controllers/ingredientController");

const routerIngredient = express.Router();

/**
 * @openapi
 * /api/ingredients:
 *   get:
 *     summary: Retrieve a list of ingredients
 *     responses:
 *       200:
 *         description: A list of ingredients
 *   post:
 *     summary: Create a new ingredient
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
 *         description: routes created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/ingredients/{id}:
 *   get:
 *     summary: Get an routes by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single routes
 *       404:
 *         description: routes not found
 *   put:
 *     summary: Update an routes by ID
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
 *         description: routes updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: routes not found
 *   delete:
 *     summary: Delete an routes by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: routes deleted
 *       404:
 *         description: routes not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
  body("name").isString().notEmpty().withMessage("name is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("price must be a positive number"),
];

routerIngredient.get("/", ingredientController.findAll);
routerIngredient.post(
  "/",
  createAndUpdateValidations,
  ingredientController.create,
);
routerIngredient.get(
  "/:id",
  [param("id").isInt().withMessage("id must be an integer")],
  ingredientController.findOne,
);
routerIngredient.put(
  "/:id",
  [
    param("id").isInt().withMessage("id must be an integer"),
    ...createAndUpdateValidations,
  ],
  ingredientController.update,
);
routerIngredient.delete(
  "/:id",
  [param("id").isInt().withMessage("id must be an integer")],
  ingredientController.delete,
);

module.exports = routerIngredient;
