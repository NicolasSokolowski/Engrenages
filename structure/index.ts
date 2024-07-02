import { app } from "./app/app.index";
import { pool } from "./app/database/pg.client";

const start = async () => {
  pool.query('SELECT 1;', (err: Error, res: any) => {
    if (err) {
      console.error('Failed to connect to the database: ', err);
      process.exit(1);
    } else {
      console.log('Connected to the database!');
    }
  });
  
  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();