import "dotenv/config";
import { Pool } from "pg";

const poolConfig = {
  connectionString: `${process.env.PG_URI}`
}

const pool = new Pool(poolConfig);

export { pool };
