const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
require('dotenv').config();

// PostgreSQL 连接配置
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// 测试数据库连接
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.stack);
  } else {
    console.log('✅ 数据库连接成功:', res.rows[0].now);
  }
});

// 静态资源访问目录
app.use(express.static(path.join(__dirname, 'public')));

// 获取 media 表中的图片和视频数据
app.get('/api/media', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.media ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ 查询失败:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
