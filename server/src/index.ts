require('dotenv').config();
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import mikroConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostsResolver } from "./resolvers/posts";
import { UserResolver } from "./resolvers/users";

const main = async () => {
    const port = process.env.PORT || 3005;

    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true,
    }));

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostsResolver, UserResolver],
            validate: false,
        }),
        context: (req, res) => ({ em: orm.em, req, res })
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}

main();

export { };

