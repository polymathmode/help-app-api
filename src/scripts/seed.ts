

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/password'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data first
  await prisma.user.deleteMany()
  await prisma.service.deleteMany()

  // Create admin user
  const adminPassword = await hashPassword('admin123')
  await prisma.user.create({
    data: {
      email: 'adminuser@help-app.com',
      password: adminPassword,
      firstName: 'Admini',
      lastName: 'Users',
      type: 'CLIENT',
      isAdmin: true
    }
  })

  // Create sample services
  await Promise.all([
    prisma.service.create({
      data: {
        name: 'House Cleaning Servicesdf',
        description: 'Professional house cleaning service',
        category: 'Cleaning',
        basePrice: 50.0
      }
    }),
    prisma.service.create({
      data: {
        name: 'Plumbing Repair',
        description: 'Emergency and routine plumbing services',
        category: 'Plumbing',
        basePrice: 75.0
      }
    })
  ])

  // Create test users
  const clientPassword = await hashPassword('client123')
  await prisma.user.create({
    data: {
      email: 'clientelle@example.com',
      password: clientPassword,
      firstName: 'John',
      lastName: 'Client',
      type: 'CLIENT'
    }
  })

  const providerPassword = await hashPassword('provider123')
  await prisma.user.create({
    data: {
      email: 'provider@example.com',
      password: providerPassword,
      firstName: 'Jane',
      lastName: 'Provider',
      type: 'PROVIDER'
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
