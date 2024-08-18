import "dotenv/config";
import { Pool } from 'pg';
import { exec } from "child_process";


const poolConfig = {
  connectionString: 
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST || "localhost"}:${process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432}/${process.env.NODE_ENV === "test" ? process.env.POSTGRES_TEST_DATABASE : process.env.POSTGRES_DATABASE}`
};

const pool = new Pool(poolConfig);


beforeAll(async () => {
  pool.query('SELECT 1;', (err: Error, res: any) => {
    if (err) {
      console.error('Failed to connect to the database: ', err);
      process.exit(1);
    } else {
      console.log('Connected to the database!');
    }
  });
});

beforeEach(async () => {
  const deleteLocationTypes = `DELETE FROM "location_type"`;
  const deleteLocationBlockages = `DELETE FROM "location_blockage_type"`;
  const deleteLocations = `DELETE FROM "location"`;

  try {
    await pool.query(deleteLocations);
    await pool.query(deleteLocationTypes);
    await pool.query(deleteLocationBlockages);
  } catch (err) {
    console.error(err);
  }
})

afterAll(async () => {
  if (pool) {
    await pool.end();
  }

  await new Promise((resolve, reject) => {
    exec("npm run db:reset", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing db:reset: ${error}`);
        reject(error);
      } else {
        if (stderr) console.error(`stderr: ${stderr}`);
        resolve(stdout);
      }
    });
  });
});
