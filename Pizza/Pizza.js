// Pizza/entities/Pizza.js
const db = require('../config/database');

class Pizza {
    static create({ name, description, imageUrl, price, ingredients = [] }) {
        return new Promise((resolve, reject) => {
            if (ingredients.length > 0) {
                const placeholders = ingredients.map(() => '?').join(',');
                db.all(`SELECT id FROM ingredients WHERE id IN (${placeholders})`, ingredients, (err, rows) => {
                    if (err) return reject(err);

                    const validIds = rows.map(r => r.id);
                    const invalidIds = ingredients.filter(id => !validIds.includes(id));

                    if (invalidIds.length > 0) {
                        return reject(new Error(`IDs d'ingrédients invalides : ${invalidIds.join(', ')}`));
                    }

                    // Tous les ingrédients sont valides → on peut insérer la pizza
                    insertPizza(validIds);
                });
            } else {
                // Aucun ingrédient → on peut insérer la pizza directement
                insertPizza([]);
            }

            function insertPizza(validIds) {
                const sql = `INSERT INTO pizzas (name, description, imageUrl, price, created_at, updated_at)
                         VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`;
                const params = [name, description || null, imageUrl || null, price];

                db.run(sql, params, function (err) {
                    if (err) return reject(err);
                    const pizzaId = this.lastID;

                    if (validIds.length === 0) {
                        return Pizza.findById(pizzaId).then(resolve).catch(reject);
                    }

                    const tasks = validIds.map(ingredientId =>
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
            }
        });
    }

    static findAll() {
        const sqlPizzas = `SELECT * FROM pizzas ORDER BY id ASC`;
        const sqlIngredients = `
        SELECT i.id, i.name
        FROM ingredients i
        JOIN pizzas_ingredients pi ON i.id = pi.ingredientsId
        WHERE pi.pizzasId = ?
        `;

        return new Promise((resolve, reject) => {
            db.all(sqlPizzas, [], (err, pizzas) => {
                if (err) return reject(err);
                if (!pizzas || pizzas.length === 0) return resolve([]);

                const promises = pizzas.map(pizza => {
                    return new Promise((resolve, reject) => {
                        db.all(sqlIngredients, [pizza.id], (err, ingredients) => {
                            if (err) return reject(err);
                            pizza.ingredients = ingredients;
                            resolve(pizza);
                        });
                    });
                });

                Promise.all(promises)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    static findById(id) {
        const sqlPizza = `SELECT * FROM pizzas WHERE id = ?`;
        const sqlIngredients = `
            SELECT i.id, i.name
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
                if (this.changes === 0) return resolve(null); // pizza non trouvée

                if (!Array.isArray(ingredients)) {
                    return Pizza.findById(id).then(resolve).catch(reject);
                }

                const handleIngredients = () => {
                    if (ingredients.length === 0) {
                        return new Promise((res, rej) => {
                            db.run(`DELETE FROM pizzas_ingredients WHERE pizzasId = ?`, [id], (err) => {
                                if (err) return rej(err);
                                res();
                            });
                        }).then(() => Pizza.findById(id)).then(resolve).catch(reject);
                    }

                    const placeholders = ingredients.map(() => '?').join(',');
                    db.all(`SELECT id FROM ingredients WHERE id IN (${placeholders})`, ingredients, (err, rows) => {
                        if (err) return reject(err);

                        const validIds = rows.map(r => r.id);
                        const invalidIds = ingredients.filter(i => !validIds.includes(i));
                        if (invalidIds.length > 0) {
                            return reject(new Error(`IDs d'ingrédients invalides : ${invalidIds.join(', ')}`));
                        }

                        new Promise((res, rej) => {
                            db.run(`DELETE FROM pizzas_ingredients WHERE pizzasId = ?`, [id], (err) => {
                                if (err) return rej(err);
                                res();
                            });
                        }).then(() => {
                            const tasks = validIds.map(ingredientId =>
                                new Promise((res, rej) => {
                                    db.run(
                                        `INSERT OR IGNORE INTO pizzas_ingredients (pizzasId, ingredientsId) VALUES (?, ?)`,
                                        [id, ingredientId],
                                        err => (err ? rej(err) : res())
                                    );
                                })
                            );

                            return Promise.all(tasks);
                        }).then(() => Pizza.findById(id)).then(resolve).catch(reject)
                            .catch(reject);
                    });
                };

                handleIngredients();
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
