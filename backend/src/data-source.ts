// import { DataSource } from "typeorm";
// import { User } from "./entities/User";
// import { Role } from "./entities/Role";
// import { Ticket } from "./entities/Ticket";
// import { Log } from "./entities/Log";

// export const AppDataSource = new DataSource({
//   type: "sqlite",
//   database: "db.sqlite",
//   synchronize: true,
//   logging: false,
//   entities: [User, Role, Ticket, Log],
//   migrations: [],
//   subscribers: [],
// });

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

/**
 * db: Turso database client
 * Use db.execute(sql, params) for all queries
 */
export const db = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
});

console.log('Turso client initialized');