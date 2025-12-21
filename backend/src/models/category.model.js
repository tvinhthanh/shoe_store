const db = require("../config/db");

(async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS categories (
      id_category INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'active'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await db.execute(sql);
})().catch(console.error);

const Categories = {
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM categories");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM categories WHERE id_category = ?",
      [id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO categories (name, description, status)
      VALUES (?, ?, ?)
    `;
    const [res] = await db.execute(sql, [
      data.name,
      data.description || null,
      data.status || "active",
    ]);
    return res;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE categories
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          status = COALESCE(?, status)
      WHERE id_category = ?
    `;
    const [res] = await db.execute(sql, [
      data.name ?? null,
      data.description ?? null,
      data.status ?? null,
      id,
    ]);
    return res;
  },

  delete: async (id) => {
    const [res] = await db.execute(
      "DELETE FROM categories WHERE id_category = ?",
      [id]
    );
    return res;
  },
};

module.exports = Categories;
