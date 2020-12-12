import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
//
import { Post } from "./entities/Post";
import { User } from "./entities/User";


require('dotenv').config();

const { PGDATABASE } = process.env;

const db = {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: PGDATABASE,
  type: "postgresql",
  debug: !__prod__,
};

export default db as Parameters<typeof MikroORM.init>[0];