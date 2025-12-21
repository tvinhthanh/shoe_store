const db = require("../config/db");

(async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS payments (
      id_payment INT AUTO_INCREMENT PRIMARY KEY,
      id_order INT NOT NULL,
      method VARCHAR(100),
      amount DECIMAL(10,2),
      status VARCHAR(50),
      gateway_txn_id VARCHAR(255),
      paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_order) REFERENCES orders(id_order) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await db.execute(sql);
})().catch(console.error);

const Payments = {
  getByOrder: async (orderId) => {
    const [rows] = await db.execute(
      "SELECT * FROM payments WHERE id_order = ?",
      [orderId]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO payments (
        id_order, method, amount, status, gateway_txn_id
      )
      VALUES (?, ?, ?, ?, ?)
    `;
    const [res] = await db.execute(sql, [
      data.id_order,
      data.method || null,
      data.amount || null,
      data.status || null,
      data.gateway_txn_id || null,
    ]);
    return res;
  },

  updateStatus: async (idPayment, status) => {
    const [res] = await db.execute(
      "UPDATE payments SET status = ? WHERE id_payment = ?",
      [status, idPayment]
    );
    return res;
  },
};

module.exports = Payments;
