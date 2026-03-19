import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Initialize the Neon Postgres Connection
const connectionString = `${process.env.DATABASE_URL}`

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString })

  // By casting pool "as any", we bypass the strict version mismatch
  // between the @types/pg library and Prisma's internal types.
  const adapter = new PrismaPg(pool as any)

  return new PrismaClient({ adapter })
}

// Next.js hot-reloading preservation (prevents maxing out database connections)
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma