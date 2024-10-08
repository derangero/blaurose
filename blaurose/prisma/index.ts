import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // TODO ここに処理を記載する
    const alice = await prisma.company.findUnique({
        where: { company_code: '1111' }
    })

    console.log(alice)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })