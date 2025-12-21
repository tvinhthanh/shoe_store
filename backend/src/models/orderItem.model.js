const db = require("../config/db");
const ProductVariants = require("./productVariant.model");

(async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS order_items (
      id_order_item INT AUTO_INCREMENT PRIMARY KEY,
      id_order INT NOT NULL,
      id_product INT NOT NULL,
      id_variant INT,
      quantity INT NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (id_order) REFERENCES orders(id_order) ON DELETE CASCADE,
      FOREIGN KEY (id_product) REFERENCES products(id_product),
      FOREIGN KEY (id_variant) REFERENCES product_variants(id_variant)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await db.execute(sql);
})().catch(console.error);

const OrderItems = {
  getByOrder: async (orderId) => {
    const [rows] = await db.execute(
      "SELECT * FROM order_items WHERE id_order = ?",
      [orderId]
    );
    return rows;
  },

  createMany: async (items) => {
    const sql = `
      INSERT INTO order_items (
        id_order, id_product, id_variant, quantity, unit_price, total_price
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const promises = items.map((it) =>
      db.execute(sql, [
        it.id_order,
        it.id_product,
        it.id_variant || null,
        it.quantity,
        it.unit_price,
        it.total_price,
      ])
    );
    await Promise.all(promises);

    // Cập nhật stock của variant và product sau khi tạo order items
    const productIdsToSync = new Set();
    for (const item of items) {
      if (item.id_variant) {
        // Giảm stock của variant
        await db.execute(
          "UPDATE product_variants SET stock = stock - ? WHERE id_variant = ?",
          [item.quantity, item.id_variant]
        );
        // Lưu productId để sync sau
        if (item.id_product) {
          productIdsToSync.add(item.id_product);
        }
      }
    }

    // Sync stock của product từ tổng stock các variant
    for (const productId of productIdsToSync) {
      await ProductVariants.syncProductStock(productId);
    }
  },
};

module.exports = OrderItems;
