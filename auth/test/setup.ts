import "dotenv/config";
import { Pool } from 'pg';
import { exec } from "child_process";
import { Password } from "@zencorp/engrenages";


const poolConfig = {
  connectionString: 
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST || "localhost"}:${process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432}/${process.env.NODE_ENV === "test" ? process.env.POSTGRES_TEST_DATABASE : process.env.POSTGRES_DATABASE}`
};

const pool = new Pool(poolConfig);

async function databaseInsertsForTests() {
  const operatorRoleCreationQuery = 
    `INSERT INTO "role" (name) 
    VALUES ('operator');`;

  const adminRoleCreationQuery = 
    `INSERT INTO "role" (name) 
    VALUES ('admin');`;

  const adminCreationQuery = async (first_name: string, last_name: string, email: string, password: string, role_name: string) => {
    const hashedPassword = await Password.toHash(password);
    return {
      text: `INSERT INTO "user" (first_name, last_name, email, password, role_name)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING;`,
      values: [first_name, last_name, email, hashedPassword, role_name]
    };
  };

  const operatorCreationQuery = async (first_name: string, last_name: string, email: string, password: string, role_name: string) => {
    const hashedPassword = await Password.toHash(password);
    return {
      text: `INSERT INTO "user" (first_name, last_name, email, password, role_name)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING;`,
      values: [first_name, last_name, email, hashedPassword, role_name]
    };
  }

  try {
    await pool.query(adminRoleCreationQuery);
    await pool.query(operatorRoleCreationQuery);
    
    const adminUserQuery = await adminCreationQuery('Admin', 'Admin', 'admin@test.com', 'password', 'admin');
    const operatorUserQuery = await operatorCreationQuery('Operator', 'Operator', 'operator@test.com', 'password', 'operator');
    await pool.query(adminUserQuery);
    await pool.query(operatorUserQuery);
  } catch (err) {
    console.error(err);
  }
}

async function databaseDeletionAfterTests() {
  const deleteUsers = `DELETE FROM "user"`;
  const deleteRoles = `DELETE FROM "role"`;

  try {
    await pool.query(deleteUsers);
    await pool.query(deleteRoles);
  } catch (err) {
    console.error(err);
  }
}

beforeAll(async () => {
  pool.query('SELECT 1;', (err: Error, res: any) => {
    if (err) {
      console.error('Failed to connect to the database: ', err);
      process.exit(1);
    } else {
      console.log('Connected to the database!');
    }
  });

  await databaseInsertsForTests();
});

beforeEach(async () => {
  await databaseDeletionAfterTests();
  await databaseInsertsForTests();
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
