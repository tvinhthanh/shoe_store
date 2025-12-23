const router = require("express").Router();
const db = require("../config/db");

// GET DASHBOARD STATISTICS
router.get("/dashboard", async (req, res) => {
  try {
    // Tổng số danh mục
    const [categories] = await db.execute("SELECT COUNT(*) as total FROM categories");
    
    // Tổng số khách hàng (users)
    const [users] = await db.execute("SELECT COUNT(*) as total FROM users WHERE role = 'user'");
    
    // Tổng số sản phẩm
    const [products] = await db.execute("SELECT COUNT(*) as total FROM products");
    
    // Tổng số biến thể
    const [variants] = await db.execute("SELECT COUNT(*) as total FROM product_variants");
    
    // Tổng số đơn hàng
    const [orders] = await db.execute("SELECT COUNT(*) as total FROM orders");
    
    // Tổng số đánh giá
    const [reviews] = await db.execute("SELECT COUNT(*) as total FROM reviews");

    // Đơn hàng mới (5 đơn hàng gần nhất)
    const [newOrders] = await db.execute(`
      SELECT 
        o.id_order,
        o.order_code,
        o.total_amount,
        o.status,
        o.created_at,
        u.name AS customer_name
      FROM orders o
      LEFT JOIN users u ON o.id_user = u.id_user
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    // Sản phẩm bán chạy (top 5 sản phẩm có nhiều order_items nhất)
    const [bestSellers] = await db.execute(`
      SELECT 
        p.id_product,
        p.name,
        p.image,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
      FROM products p
      INNER JOIN order_items oi ON p.id_product = oi.id_product
      GROUP BY p.id_product, p.name, p.image
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    res.json({
      stats: {
        categories: categories[0].total,
        customers: users[0].total,
        products: products[0].total,
        variants: variants[0].total,
        orders: orders[0].total,
        reviews: reviews[0].total,
      },
      newOrders: newOrders || [],
      bestSellers: bestSellers || [],
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

