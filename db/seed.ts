import { guid } from 'zod'
import { db } from './index'
import * as schema from './schema'
import { hash, randomUUIDv5 } from 'bun'

async function seed () {
  console.log('Seeding database...')

  // Clear existing data
  await db.delete(schema.orderItems).run()
  await db.delete(schema.reorderNotices).run()
  await db.delete(schema.orders).run()
  await db.delete(schema.redeemCodes).run()
  await db.delete(schema.products).run()
  await db.delete(schema.customers).run()
  await db.delete(schema.users).run()

  const hashedPassword = await hash('password')

  const userData = [
    {
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      password: hashedPassword,
      role: 'customer'
    },
    {
      name: 'Sara Smith',
      email: 'sara@example.com',
      password: hashedPassword,
      role: 'customer'
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    }
  ]

  // Seed users
  const insertedUsers = await db
    .insert(schema.users)
    .values(userData as any)
    .returning()

  // Seed customers

  const customerData = insertedUsers.map((user, index) => ({
    userId: user.id,
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ')[1] || 'User',
    houseNo: `${10 + index}`,
    streetName: 'Tech Street',
    city: 'Cairo',
    zipCode: '11223',
    phone: `012345678${index}`,
    creditLimit: 5000.0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }))

  const insertedCustomers = await db
    .insert(schema.customers)
    .values(customerData as any)
    .returning()

  // Seed products

  const productData = [
    {
      name: 'Laptop Pro',
      costPrice: 800,
      sellPrice: 1200,
      currentQuantity: 50,
      reorderLevel: 5,
      reorderQuantity: 10,
      images: ['img1.jpg']
    },
    {
      name: 'Wireless Mouse',
      costPrice: 10,
      sellPrice: 25,
      currentQuantity: 200,
      reorderLevel: 20,
      reorderQuantity: 50,
      images: ['img2.jpg']
    },
    {
      name: 'Monitor 4K',
      costPrice: 200,
      sellPrice: 350,
      currentQuantity: 30,
      reorderLevel: 5,
      reorderQuantity: 10,
      images: ['img3.jpg']
    },
    {
      name: 'Mechanical Keyboard',
      costPrice: 40,
      sellPrice: 85,
      currentQuantity: 15,
      reorderLevel: 10,
      reorderQuantity: 20,
      images: ['img4.jpg']
    }
  ]

  const insertedProducts = await db
    .insert(schema.products)
    .values(productData as any)
    .returning()

  if (!insertedCustomers[0] || !insertedProducts[0]) {
    throw new Error('Failed to create customer or product')
  }

  // Seed orders
  const order = await db
    .insert(schema.orders)
    .values([
      {
        customerID: insertedCustomers[0].id,
        totalPrice: 150.5,
        dueDate: new Date().toISOString(),
        orderStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      {
        customerID: insertedCustomers[1]?.id || 2,
        totalPrice: 200.0,
        dueDate: new Date().toISOString(),
        orderStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ])
    .returning()
  if (!order[0]) {
    throw new Error('Failed to create order')
  }

  // Seed order items
  await db
    .insert(schema.orderItems)
    .values({
      orderID: order[0].id,
      productID: insertedProducts[0].id,
      quantity: 2,
      itemTotalPrice: 100.0,
      deliveryStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .run()

  console.log('Seeding complete.')
}

seed().catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
