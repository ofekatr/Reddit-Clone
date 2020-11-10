require('dotenv').config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";

import mikroConfig from "./mikro-orm.config";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostsResolver } from "./resolvers/posts";

const main = async () => {
    const port = process.env.PORT || 3005;

    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            validate: false,
            resolvers: [HelloResolver, PostsResolver],
        }),
        context: () => ({ em: orm.em })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}

main();

export { };