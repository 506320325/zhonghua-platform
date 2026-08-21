import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 在构建时，如果 DATABASE_URL 缺失，Prisma 会报错，但我们可以通过判断环境来避免
// 但这里我们保持原样，因为构建时 Next.js 不会执行 API 路由，但会解析模块
// 为了更安全，延迟初始化：但先保持现状，主要是确保 prisma generate 已执行

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma