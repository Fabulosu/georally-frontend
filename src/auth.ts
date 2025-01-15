import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/sveltekit/providers/credentials";
import axios from "axios";
import { AUTH_SECRET } from "$env/static/private";
import type { JWT } from "@auth/core/jwt";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

declare module '@auth/sveltekit' {
    interface Session {
        user: {
            _id: string;
            email: string;
            name: string;
        };

        backendTokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        user: {
            _id: string;
            email: string;
            name: string;
        };

        backendTokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}

async function refreshToken(token: JWT): Promise<JWT> {
    const res = await fetch(PUBLIC_BACKEND_URL + "/auth/refresh", {
        method: "POST",
        headers: {
            authorization: `Refresh ${token.backendTokens.refreshToken}`,
        },
    });

    const response = await res.json();

    return {
        ...token,
        backendTokens: response,
    };
}

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

                    const res = await axios.post(PUBLIC_BACKEND_URL + "/auth/login", { email, password });

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
    callbacks: {
        async jwt({ token, user }) {
            if (user) return { ...token, ...user };

            if (new Date().getTime() < token.backendTokens.expiresIn) return token;
            return await refreshToken(token);
        },

        async session({ token, session }) {
            session.user = {
                ...token.user,
                id: token.user._id,
                emailVerified: null
            };
            session.backendTokens = token.backendTokens;

            return session;
        }
    },
    trustHost: true,
    secret: AUTH_SECRET,
})