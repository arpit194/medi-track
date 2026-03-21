import 'dotenv/config'
import * as bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const REPORT_TYPES = ['Blood Test', 'X-Ray', 'Prescription', 'MRI', 'CT Scan', 'Ultrasound', 'ECG', 'Pathology']
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const GENDERS = ['male', 'female', 'non-binary', 'prefer not to say']

async function main() {
  console.log('Seeding database...')

  const passwordHash = await bcrypt.hash('password123', 12)

  // ---- Seed users ----

  const userCount = 3
  const users = await Promise.all(
    Array.from({ length: userCount }).map(async (_, i) => {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const email = i === 0 ? 'demo@example.com' : faker.internet.email({ firstName, lastName }).toLowerCase()

      return prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name: `${firstName} ${lastName}`,
          email,
          password: passwordHash,
          dob: faker.date.birthdate({ min: 25, max: 75, mode: 'age' }).toISOString().split('T')[0],
          bloodType: faker.helpers.arrayElement(BLOOD_TYPES),
          gender: faker.helpers.arrayElement(GENDERS),
          isOnboarded: true,
        },
      })
    }),
  )

  console.log(`Created ${users.length} users (demo login: demo@example.com / password123)`)

  // ---- Seed reports ----

  let totalReports = 0

  for (const user of users) {
    const reportCount = faker.number.int({ min: 3, max: 8 })

    await Promise.all(
      Array.from({ length: reportCount }).map(async () => {
        const fileCount = faker.number.int({ min: 1, max: 3 })

        await prisma.report.create({
          data: {
            userId: user.id,
            type: faker.helpers.arrayElement(REPORT_TYPES),
            title: faker.lorem.words({ min: 2, max: 5 }),
            date: faker.date.between({ from: '2022-01-01', to: new Date() }).toISOString().split('T')[0],
            doctorName: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
            notes: faker.datatype.boolean(0.7) ? faker.lorem.sentences({ min: 1, max: 3 }) : null,
            files: {
              create: Array.from({ length: fileCount }).map(() => ({
                key: faker.string.uuid(),
                url: `https://placehold.co/600x800/png`,
                name: `${faker.system.fileName()}.pdf`,
                size: faker.number.int({ min: 50000, max: 2000000 }),
              })),
            },
          },
        })

        totalReports++
      }),
    )
  }

  console.log(`Created ${totalReports} reports`)
  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
