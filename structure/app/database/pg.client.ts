import "dotenv/config";
import { Pool } from "pg";

const URI = process.env.PG_URI;

const poolConfig = {
  connectionString: `${URI}`
}

const pool = new Pool(poolConfig);

export { pool };
