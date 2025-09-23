#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
};

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'office_management';
  
  // Connect to postgres database first
  const adminPool = new Pool({ ...dbConfig, database: 'postgres' });
  
  try {
    // Check if database exists
    const checkDb = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    
    if (checkDb.rows.length === 0) {
      // Create database
      await adminPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`ℹ️  Database '${dbName}' already exists`);
    }
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    process.exit(1);
  } finally {
    await adminPool.end();
  }
}

async function initializeSchema() {
  const dbName = process.env.DB_NAME || 'office_management';
  const pool = new Pool({ ...dbConfig, database: dbName });
  
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '../src/database/complete_system_schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schema);
    console.log('✅ Database schema initialized successfully');
    
    // Insert demo admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await pool.query(`
      INSERT INTO users (first_name, last_name, email, password_hash, role, is_active)
      VALUES ('Admin', 'User', 'admin@demo.com', $1, 'administrator', true)
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);
    
    console.log('✅ Demo admin user created (email: admin@demo.com, password: admin123)');
    
    // Insert demo data
    await insertDemoData(pool);
    
  } catch (error) {
    console.error('❌ Error initializing schema:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function insertDemoData(pool) {
  try {
    // Insert demo clients
    await pool.query(`
      INSERT INTO clients (
        company_name, company_nip, company_regon, company_address,
        contact_person_first_name, contact_person_last_name,
        contact_person_email, contact_person_phone,
        industry, company_size, contract_type, is_active
      ) VALUES 
      ('ABC Sp. z o.o.', '1234567890', '123456789', 'ul. Przykładowa 1, 00-001 Warszawa',
       'Jan', 'Kowalski', 'jan.kowalski@abc.pl', '+48 123 456 789',
       'technology', 'medium', 'standard', true),
      ('XYZ Firma', '0987654321', '987654321', 'ul. Testowa 2, 01-002 Kraków',
       'Anna', 'Nowak', 'anna.nowak@xyz.pl', '+48 987 654 321',
       'consulting', 'small', 'premium', true)
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ Demo client data inserted');
  } catch (error) {
    console.log('ℹ️  Demo data may already exist:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting database setup...');
  
  try {
    await createDatabase();
    await initializeSchema();
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Copy .env.example to .env and update database credentials');
    console.log('2. Run "npm run dev" to start development server');
    console.log('3. Run "npm run electron-dev" to start the desktop app');
  } catch (error) {
    console.error('💥 Setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}