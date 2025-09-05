import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Role } from "./entities/Role";
import { Ticket } from "./entities/Ticket";
import { Log } from "./entities/Log";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Role, Ticket, Log],
  migrations: [],
  subscribers: [],
});
