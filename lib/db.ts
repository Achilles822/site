import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

export function getSql(): NeonQueryFunction<false, false> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("缺少 DATABASE_URL")
  }
  return neon(databaseUrl)
}
