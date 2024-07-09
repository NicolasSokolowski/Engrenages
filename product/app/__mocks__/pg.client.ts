// UTILISATION D'UNE DB EN MEMOIRE AVEC PG-MEM
// PROBLEMATIQUE : PG-MEM NE SUPPORTE PAS LES FONCTIONS SQL
//
// "moduleNameMapper": {
//   "^pg$": "<rootDir>/app/__mocks__/pg.client.ts"
// }

// import { newDb } from "pg-mem";

// const db = newDb();

// db.public.none(`
//     CREATE TABLE product (
//       id SERIAL PRIMARY KEY,
//       title VARCHAR(100) NOT NULL UNIQUE,
//       description TEXT NOT NULL,
//       ean CHAR(13) NOT NULL UNIQUE,
//       length DECIMAL NOT NULL,
//       width DECIMAL NOT NULL,
//       height DECIMAL NOT NULL,
//       product_img TEXT,
//       price DECIMAL NOT NULL,
//       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//       updated_at TIMESTAMPTZ
//     )`
// );

  
// const pg = db.adapters.createPg();



// export * from "pg";
// export const Pool = pg.Pool;
// export const Client = pg.Client;