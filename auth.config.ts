import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")
            const isOnPublicPage = nextUrl.pathname === "/" // We might want to protect the home page too, technically

            if (isOnAuthPage) {
                if (isLoggedIn) return Response.redirect(new URL("/", nextUrl))
                return true
            }

            // If user is not logged in and not on an auth page, allow them to stay 
            // ONLY IF we want public access. But user requested auth.
            // So detailed logic:
            // - If not logged in, redirect to /login
            // - Except for register page

            if (!isLoggedIn) {
                return false // Redirect unauthenticated users to login page
            }

            return true
        },
        session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
