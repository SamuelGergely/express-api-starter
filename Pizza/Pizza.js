// Pizza/entities/Pizza.js
const db = require('../config/database');

class Pizza {
    static create({ name, description, imageUrl, price, ingredients = [] }) {
        const sql = `INSERT INTO pizzas (name, description, imageUrl, price, created_at, updated_at)
                 VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`;
        const params = [name, description || null, imageUrl || null, price];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                // fetch created row
                const pizzaId = this.lastID;

                const tasks = ingredients.map(ingredientId =>
                    new Promise((res, rej) => {
                        db.run(
                            `INSERT OR IGNORE INTO pizzas_ingredients (pizzasId, ingredientsId) VALUES (?, ?)`,
                            [pizzaId, ingredientId],
                            err => (err ? rej(err) : res())
                        );
                    })
                );

                Promise.all(tasks)
                .then(() => Pizza.findById(pizzaId).then(resolve).catch(reject))
                .catch(reject);
            });
        });
    }

    static findAll() {
        const sqlPizzas = `SELECT * FROM pizzas ORDER BY id ASC`;
        return new Promise((resolve, reject) => {
            db.all(sqlPizzas, [], (err, pizzas) => {
                if (err) return reject(err);
                resolve(pizzas);
            })
        });
    }

    static findById(id) {
        const sqlPizza = `SELECT * FROM pizzas WHERE id = ?`;
        const sqlIngredients = `
            SELECT i.id, i.name, i.price
            FROM ingredients i
            JOIN pizzas_ingredients pi ON i.id = pi.ingredientsId
            WHERE pi.pizzasId = ?
        `;

        return new Promise((resolve, reject) => {
            db.get(sqlPizza, [id], (err, pizza) => {
                if (err) return reject(err);
                if (!pizza) return resolve(null);

                db.all(sqlIngredients, [id], (err, ingredients) => {
                    if (err) return reject(err);
                    pizza.ingredients = ingredients;
                    resolve(pizza);
                })
            });
        });
    }

    static update(id, { name, description, imageUrl, price, ingredients }) {
        const sql = `
      UPDATE pizzas
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          imageUrl = COALESCE(?, imageUrl),
          price = COALESCE(?, price),
          updated_at = datetime('now')
      WHERE id = ?
    `;
    const params = [name, description, imageUrl, price, id];

    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            if (this.changes === 0) return resolve(null);

            if (Array.isArray(ingredients)) {
                db.run(`DELETE FROM pizzas_ingredients WHERE id = ?`, [id], (err) => {
                    if (err) return reject(err);

                    const tasks = ingredients.map(ingredientId =>
                        new Promise((res, rej) => {
                            db.run(
                                `INSERT OR IGNORE INTO pizzas_ingredients (pizzasId, ingredientsId) VALUES (?, ?)`
                                [id, ingredientId],
                                err => (err ? rej(err) : res())
                            )
                        })
                    );

                    Promise.all(tasks)
                        .then(() => Pizza.findById(id)).then(resolve).catch(reject)
                        .catch(reject);
                });
            } else {
                Pizza.findById(id).then(resolve).catch(reject);
            }
        });
    });
    }

    static delete(id) {
        const sql = `DELETE FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // number of rows deleted
            });
        });
    }

    static addIngredient(pizzaId, ingredientId) {
        const sql = `INSERT OR IGNORE INTO pizzas_ingredients (pizzasID, ingredientsId) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(sql, [pizzaId, ingredientId], function (err) {
                if (err) return reject(err);
                resolve({ pizzaId, ingredientId });
            });
        });
    }

    static getIngredient(pizzaId) {
        const sql = `
        SELECT i.id, i.name, i.price
        FROM ingredients i
        JOIN pizzas_ingredients pi ON i.id= pi.ingredientsId
        WHERE pi.pizzasId = ?
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [pizzaId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static removeIngredient(pizzaId, ingredientId) {
        const sql = `DELETE FROM pizzas_ingredients WHERE pizzasId = ? AND ingredientId= ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [pizzaId, ingredientId], function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = Pizza;
