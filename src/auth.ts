import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/sveltekit/providers/credentials";
import axios from "axios";
import { AUTH_SECRET } from "$env/static/private";

export const { handle, signIn, signOut } = SvelteKitAuth({
    pages: {
        signIn: '/login',
        // error: '/login',
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Missing email or password");
                    }

                    const { email, password } = credentials;

                    const res = await axios.post("https://georally-backend-production.up.railway.app/auth/login", { email, password });

                    const user = res.data;

                    if (res.status !== 200) {
                        return null;
                    }

                    return user;
                } catch (error: Error | any) {
                    console.error(error.message);

                    return null;
                }
            }

        })
    ],
    trustHost: true,
    secret: AUTH_SECRET,
})