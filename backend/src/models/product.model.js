const db = require("../config/db");

// Tạo bảng nếu chưa có
(async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS products (
      id_product INT AUTO_INCREMENT PRIMARY KEY,
      id_category INT NOT NULL,
      sku VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      cost DECIMAL(10,2),
      stock INT DEFAULT 0,
      unit VARCHAR(50),
      image TEXT,
      rating_avg DECIMAL(3,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (id_category) REFERENCES categories(id_category) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await db.execute(sql);
})().catch(console.error);

const Products = {
  getAll: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM products ORDER BY id_product DESC"
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM products WHERE id_product = ?",
      [id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO products (
        id_category, sku, name, description, price, cost,
        stock, unit, image, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [res] = await db.execute(sql, [
      data.id_category,
      data.sku,
      data.name,
      data.description || null,
      data.price,
      data.cost || null,
      0,
      data.unit || null,
      data.image || null,
      data.status || "active",
    ]);
    return res;
  },

  update: async (id, data) => {
    // Không cho phép cập nhật stock trực tiếp - stock được tính từ variants
    const { stock, ...dataWithoutStock } = data;

    const sql = `
      UPDATE products
      SET id_category = COALESCE(?, id_category),
          sku = COALESCE(?, sku),
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          cost = COALESCE(?, cost),
          unit = COALESCE(?, unit),
          image = COALESCE(?, image),
          status = COALESCE(?, status)
      WHERE id_product = ?
    `;
    const [res] = await db.execute(sql, [
      dataWithoutStock.id_category ?? null,
      dataWithoutStock.sku ?? null,
      dataWithoutStock.name ?? null,
      dataWithoutStock.description ?? null,
      dataWithoutStock.price ?? null,
      dataWithoutStock.cost ?? null,
      dataWithoutStock.unit ?? null,
      dataWithoutStock.image ?? null,
      dataWithoutStock.status ?? null,
      id,
    ]);
    return res;
  },

  delete: async (id) => {
    const [res] = await db.execute(
      "DELETE FROM products WHERE id_product = ?",
      [id]
    );
    return res;
  },

  getByCategory: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM products WHERE id_category = ?",
      [id]
    );
    return rows;
  },

  search: async (keyword) => {
    const searchTerm = `%${keyword}%`;
    const [rows] = await db.execute(
      `SELECT * FROM products 
       WHERE name LIKE ? OR description LIKE ? OR sku LIKE ?
       ORDER BY id_product DESC`,
      [searchTerm, searchTerm, searchTerm]
    );
    return rows;
  },

  // Kiểm tra product có đang được sử dụng trong order_items không
  hasOrderItems: async (id) => {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM order_items WHERE id_product = ?",
      [id]
    );
    return rows[0].count > 0;
  },

  // Kiểm tra product có variants không
  hasVariants: async (id) => {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM product_variants WHERE id_product = ?",
      [id]
    );
    return rows[0].count > 0;
  },
};

module.exports = Products;
