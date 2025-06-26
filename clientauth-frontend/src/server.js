const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*', cors(corsOptions));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'manyam',
  password: 'Z@7rM!s2Qw#9XpLkT3',
  database: 'clientauthdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(conn => {
    console.log('Connected to MySQL database');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// Helper function to handle database errors
const handleDbError = (err, res) => {
  console.error('Database error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Database operation failed',
    error: err.message 
  });
};

// CONTRACT ENDPOINTS //

// new contract
app.post('/api/contracts', async (req, res) => {
  try {
    const {
      title, customer, contract_number, contract_type,
      rep, effective_date, invoice_timing,
      last_statement_date, last_invoiced_date,
      unused_amount, overage_amount,
      contract_template_id, description,
      subcontract_ids
    } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // main contract
      const [contractResult] = await connection.execute(
        `INSERT INTO contracts (
          title, customer, contract_number, contract_type,
          rep, effective_date, invoice_timing,
          last_statement_date, last_invoiced_date,
          unused_amount, overage_amount,
          contract_template_id, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, customer, contract_number, contract_type,
          rep, effective_date, invoice_timing,
          last_statement_date, last_invoiced_date,
          unused_amount, overage_amount,
          contract_template_id, description
        ]
      );

      const contractId = contractResult.insertId;

      // Link subcontracts 
      if (subcontract_ids && subcontract_ids.length > 0) {
        await Promise.all(
          subcontract_ids.map(subId => 
            connection.execute(
              'UPDATE subcontracts SET contract_id = ? WHERE id = ?',
              [contractId, subId]
            )
          )
        );
      }

      await connection.commit();
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Contract created successfully',
        contractId,
        subcontractLinks: subcontract_ids ? subcontract_ids.length : 0
      });

    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }

  } catch (err) {
    handleDbError(err, res);
  }
});

// Get all contracts
app.get('/api/contracts', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, 
        GROUP_CONCAT(s.id) AS subcontract_ids,
        GROUP_CONCAT(s.title) AS subcontract_titles
      FROM contracts c
      LEFT JOIN subcontracts s ON s.contract_id = c.id
      GROUP BY c.id
    `);
    
    // Format the results
    const contracts = rows.map(row => ({
      ...row,
      subcontract_ids: row.subcontract_ids ? row.subcontract_ids.split(',').map(Number) : [],
      subcontract_titles: row.subcontract_titles ? row.subcontract_titles.split(',') : []
    }));

    res.json({ success: true, contracts });

  } catch (err) {
    handleDbError(err, res);
  }
});

// Get single contract by ID
app.get('/api/contracts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get contract details
    const [contractRows] = await pool.query(
      'SELECT * FROM contracts WHERE id = ?', 
      [id]
    );

    if (contractRows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Contract not found' 
      });
    }

    const contract = contractRows[0];

    // Get linked subcontracts
    const [subcontractRows] = await pool.query(
      'SELECT id, title FROM subcontracts WHERE contract_id = ?',
      [id]
    );

    res.json({
      success: true,
      contract: {
        ...contract,
        subcontracts: subcontractRows
      }
    });

  } catch (err) {
    handleDbError(err, res);
  }
});

// SUBCONTRACT ENDPOINTS //

// Create a new subcontract
app.post('/api/subcontracts', async (req, res) => {
  try {
    const {
      title, contract_id, start_date, end_date, 
      amount, description
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO subcontracts (
        title, contract_id, start_date, end_date, 
        amount, description
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, contract_id, start_date, end_date, amount, description]
    );

    res.status(201).json({
      success: true,
      message: 'Subcontract created successfully',
      subcontractId: result.insertId
    });

  } catch (err) {
    handleDbError(err, res);
  }
});

// Get all subcontracts
app.get('/api/subcontracts', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, c.title AS contract_title
      FROM subcontracts s
      LEFT JOIN contracts c ON s.contract_id = c.id
    `);
    res.json({ success: true, subcontracts: rows });
  } catch (err) {
    handleDbError(err, res);
  }
});

// TEMPLATE ENDPOINTS //

// Get all templates
app.get('/api/templates', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM templates');
    res.json({ success: true, templates: rows });
  } catch (err) {
    handleDbError(err, res);
  }
});

// Download template file
app.get('/api/templates/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      'SELECT filePath FROM templates WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Template not found' 
      });
    }

    const filePath = rows[0].filePath;
    const fileName = path.basename(filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Template file not found'
      });
    }

    res.download(filePath, fileName);

  } catch (err) {
    handleDbError(err, res);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});