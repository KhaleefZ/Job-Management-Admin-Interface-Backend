const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    // Get database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('DATABASE_URL environment variable is not set');
      process.exit(1);
    }

    const sql = neon(databaseUrl);
    
    console.log('Setting up database...');
    
    // Read and execute the create tables script
    const createTablesScript = fs.readFileSync(
      path.join(__dirname, '01-create-tables.sql'),
      'utf8'
    );
    
    await sql(createTablesScript);
    console.log('✅ Database tables created successfully');
    
    // Read and execute the seed data script
    const seedDataScript = fs.readFileSync(
      path.join(__dirname, '02-seed-data.sql'),
      'utf8'
    );
    
    await sql(seedDataScript);
    console.log('✅ Database seeded successfully');
    
    console.log('🎉 Database setup completed!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();