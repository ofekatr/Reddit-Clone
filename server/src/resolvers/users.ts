import argon2 from "argon2";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { generateJwtToken } from "../utils/auth";
import { EntityManager } from "@mikro-orm/postgresql";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;

}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => String, { nullable: true })
    token?: string;
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        const { username, password } = options;
        if (username.length <= 2) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Username must be at least 3 characters long."
                    }
                ]
            };
        }
        if (password.length <= 3) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Password must be at least 4 characters long."
                    }
                ]
            };
        }
        const hashedPassword = await argon2.hash(password);
        let user;
        try {
            const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
                username,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date()
            }).returning("*");
            user = result[0];
        } catch (err) {
            if (err.detail.includes("already exists")) {
                // username already exists.
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username already taken."
                        }
                    ]
                }
            }
        }
        return {
            user,
            token: generateJwtToken(user),
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        const { username, password: inputPassword } = options;
        const user = await em.findOne(User, { username });
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "You have entered an invalid username or password."
                    },
                    {
                        field: "password",
                        message: "You have entered an invalid username or password."
                    }
                ]
            }
        }
        const validPassword = await argon2.verify(user.password, inputPassword);
        if (!validPassword) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "You have entered an invalid username or password."
                    },
                    {
                        field: "password",
                        message: "You have entered an invalid username or password."
                    }
                ]
            }
        }
        return {
            user,
            token: generateJwtToken(user),
        };
    }
}