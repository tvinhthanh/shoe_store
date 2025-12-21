const db = require("../config/db");

(async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS product_variants (
      id_variant INT AUTO_INCREMENT PRIMARY KEY,
      id_product INT NOT NULL,
      size VARCHAR(50),
      color VARCHAR(100),
      price_variant DECIMAL(10,2) NOT NULL,
      stock INT DEFAULT 0,
      sku_variant VARCHAR(150) UNIQUE,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_product) REFERENCES products(id_product) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await db.execute(sql);
})().catch(console.error);

const ProductVariants = {
  getByProduct: async (productId) => {
    const [rows] = await db.execute(
      "SELECT * FROM product_variants WHERE id_product = ?",
      [productId]
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM product_variants WHERE id_variant = ?",
      [id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO product_variants (
        id_product, size, color, price_variant, stock, sku_variant, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [res] = await db.execute(sql, [
      data.id_product,
      data.size || null,
      data.color || null,
      data.price_variant,
      data.stock || 0,
      data.sku_variant || null,
      data.status || "active",
    ]);
    return res;
  },

  update: async (id, data) => {
  const sql = `
      UPDATE product_variants
      SET size = COALESCE(?, size),
          color = COALESCE(?, color),
          price_variant = COALESCE(?, price_variant),
          stock = COALESCE(?, stock),
          sku_variant = COALESCE(?, sku_variant),
          status = COALESCE(?, status)
      WHERE id_variant = ?
    `;

  const [res] = await db.execute(sql, [
    data.size ?? null,
    data.color ?? null,
    data.price_variant !== undefined ? data.price_variant : null,
    data.stock !== undefined ? data.stock : null,
    data.sku_variant ?? null,
    data.status ?? null,
    id,
  ]);
  return res;
},

  delete: async (id) => {
    const [res] = await db.execute(
      "DELETE FROM product_variants WHERE id_variant = ?",
      [id]
    );
    return res;
  },

  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM product_variants");
    return rows;
  },

  syncProductStock: async (productId) => {
  const [rows] = await db.execute(
    `SELECT SUM(stock) as total FROM product_variants WHERE id_product = ?`,
    [productId]
  );

  const total = rows[0]?.total || 0;

  await db.execute(
    `UPDATE products SET stock = ? WHERE id_product = ?`,
    [total, productId]
  );

  return total;
  } 

};

module.exports = ProductVariants;