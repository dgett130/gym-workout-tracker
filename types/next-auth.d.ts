import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            hasSeenGuide: boolean
        } & DefaultSession["user"]
    }

    interface User {
        hasSeenGuide: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        hasSeenGuide: boolean
    }
}
