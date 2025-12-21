const db = require("../config/db");

(async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS reviews (
      id_review INT AUTO_INCREMENT PRIMARY KEY,
      id_product INT NOT NULL,
      id_user CHAR(36) NOT NULL,
      rating INT NOT NULL,
      title VARCHAR(255),
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_review_product_user (id_product, id_user),
      FOREIGN KEY (id_product) REFERENCES products(id_product) ON DELETE CASCADE,
      FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await db.execute(sql);
})().catch(console.error);

const Reviews = {
  getAll: async () => {
    const [rows] = await db.execute(
      `
      SELECT 
        r.id_review,
        r.id_product,
        p.name AS product_name,
        r.id_user,
        u.name AS user_name,
        r.rating,
        r.title,
        r.content,
        r.created_at
      FROM reviews r
      LEFT JOIN products p ON r.id_product = p.id_product
      LEFT JOIN users u ON r.id_user = u.id_user
      ORDER BY r.created_at DESC
      `
    );
    return rows;
  },

  getByProduct: async (productId) => {
    const [rows] = await db.execute(
      `
      SELECT 
        r.id_review,
        r.id_product,
        r.id_user,
        u.name AS user_name,
        u.email AS email,
        r.rating,
        r.title,
        r.content,
        r.created_at
      FROM reviews r
      LEFT JOIN users u ON r.id_user = u.id_user
      WHERE r.id_product = ?
      ORDER BY r.created_at DESC
      `,
      [productId]
    );
    return rows;
  },

  createOrUpdate: async (data) => {
    // upsert theo (id_product, id_user)
    const sql = `
      INSERT INTO reviews (id_product, id_user, rating, title, content)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        rating = VALUES(rating),
        title = VALUES(title),
        content = VALUES(content)
    `;
    const [res] = await db.execute(sql, [
      data.id_product,
      data.id_user,
      data.rating,
      data.title || null,
      data.content || null,
    ]);
    return res;
  },

  delete: async (idReview) => {
    const [res] = await db.execute("DELETE FROM reviews WHERE id_review = ?", [
      idReview,
    ]);
    return res;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO reviews (id_product, id_user, rating, title, content)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [res] = await db.execute(sql, [
      data.id_product,
      data.id_user,
      data.rating,
      data.title || null,
      data.content || null,
    ]);
    return res;
  },

  checkExists: async (id_product, id_user) => {
    const [rows] = await db.execute(
      "SELECT id_review FROM reviews WHERE id_product = ? AND id_user = ? LIMIT 1",
      [id_product, id_user]
    );
    return rows.length > 0;
  },

  // kiểm tra user đã từng mua sản phẩm này chưa (có order_item với id_product và order thuộc user đó)
  hasPurchased: async (id_product, id_user) => {
    const [rows] = await db.execute(
      `
      SELECT 1
      FROM order_items oi
      JOIN orders o ON oi.id_order = o.id_order
      WHERE oi.id_product = ? AND o.id_user = ?
      LIMIT 1
      `,
      [id_product, id_user]
    );
    return rows.length > 0;
  },
};

module.exports = Reviews;
