const db = require("../config/db");

// Tạo bảng nếu chưa tồn tại
(async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id_user CHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(30),
      address VARCHAR(255),
      role ENUM('user','admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await db.execute(sql);
})().catch(console.error);

const Users = {
  getAll: async () => {
    const [rows] = await db.execute(
      "SELECT id_user, name, email, phone, address, role, created_at FROM users"
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT id_user, name, email, phone, address, role, created_at FROM users WHERE id_user = ?",
      [id]
    );
    return rows[0] || null;
  },

  getByEmail: async (email) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO users (id_user, name, email, password,address, phone, role)
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;
    const [result] = await db.execute(sql, [
      data.id_user,
      data.name,
      data.email,
      data.password,
      data.address || null,
      data.phone || null,
      data.role || "user",
    ]);
    return result;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE users
      SET name = COALESCE(?, name),
          email = COALESCE(?, email), 
          phone = COALESCE(?, phone),
          role = COALESCE(?, role)
      WHERE id_user = ?
    `;
    const [result] = await db.execute(sql, [
      data.name ?? null,
      data.email ?? null,
      data.phone ?? null,
      data.role ?? null,
      id,
    ]);
    return result;
  },

  updatePassword: async (id, newPassword) => {
    const [result] = await db.execute(
      "UPDATE users SET password = ? WHERE id_user = ?",
      [newPassword, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute("DELETE FROM users WHERE id_user = ?", [
      id,
    ]);
    return result;
  },
};

module.exports = Users;
