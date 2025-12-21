const db = require("../config/db");

(async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS orders (
      id_order INT AUTO_INCREMENT PRIMARY KEY,
      id_user CHAR(36) NOT NULL,
      order_code VARCHAR(100) NOT NULL UNIQUE,
      total_amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      shipping_address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await db.execute(sql);
})().catch(console.error);

const Orders = {
  getAll: async () => {
    const [rows] = await db.execute(
      `
      SELECT 
        o.*,
        u.name AS customer_name
      FROM orders o
      LEFT JOIN users u ON o.id_user = u.id_user
      ORDER BY o.created_at DESC
      `
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute("SELECT * FROM orders WHERE id_order = ?", [
      id,
    ]);
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
    INSERT INTO orders (
      id_user, order_code, total_amount, status, shipping_address
    )
    VALUES (?, ?, ?, ?, ?)
  `;
    const [res] = await db.execute(sql, [
      data.id_user,
      data.order_code,
      data.total_amount,
      data.status || "pending",
      data.shipping_address || null,
    ]);

    return { insertId: res.insertId };
  },
  updateStatus: async (id, status) => {
    const [res] = await db.execute(
      "UPDATE orders SET status = ? WHERE id_order = ?",
      [status, id]
    );
    return res;
  },

  remove: async (id) => {
    const [res] = await db.execute("DELETE FROM orders WHERE id_order = ?", [
      id,
    ]);
    return res;
  },

  getByUser: async (userId) => {
    const [orders] = await db.execute(
      "SELECT * FROM orders WHERE id_user = ? ORDER BY created_at DESC",
      [userId]
    );

    for (const order of orders) {
      const [items] = await db.execute(
        `
      SELECT 
        oi.id_order_item,
        oi.id_product,
        p.name AS product_name,
        p.image AS product_image,

        oi.id_variant,
        v.color AS variant_color,
        v.size AS variant_size,

        oi.quantity,
        oi.unit_price,
        oi.total_price
      FROM order_items oi
      LEFT JOIN products p ON oi.id_product = p.id_product
      LEFT JOIN product_variants v ON oi.id_variant = v.id_variant
      WHERE oi.id_order = ?
      `,
        [order.id_order]
      );

      order.items = items;
    }

    return orders;
  },
};

module.exports = Orders;
