import "dotenv/config";
import { Pool } from "pg";

const poolConfig = {
  connectionString: 
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST || "localhost"}:${process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432}/${process.env.POSTGRES_TEST_DATABASE}`
};

const pool = new Pool(poolConfig);

export { pool };
