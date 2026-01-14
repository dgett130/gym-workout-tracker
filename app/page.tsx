import { auth } from "@/auth"
import { Dashboard } from "@/components/dashboard"
import { redirect } from "next/navigation"
import { db } from "@/lib/db/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function Home() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Fetch latest user data from DB to get real-time hasSeenGuide status
  // regardless of what's in the session token
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id)
  })

  // Merge session user with fresh DB data
  const user = {
    ...session.user,
    hasSeenGuide: dbUser?.hasSeenGuide ?? false
  }

  return <Dashboard user={user} />
}
