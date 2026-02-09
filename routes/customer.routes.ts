import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { db } from '../db'
import { customers } from '../db/schema'
import { schemas } from '../zod/apiSchema.json.client'
import { eq } from 'drizzle-orm'

export const customerRoutes = new Hono()

/**
 * GET /customers
 * List customers
 */
customerRoutes.get('/', async c => {
  const data = await db.select().from(customers)
  return c.json({
    status: 'success',
    data: data
  })
})

/**
 * POST /customers
 * Create customer
 */
customerRoutes.post(
  '/',
  zValidator('json', schemas.StoreCustomerRequest),
  async c => {
    const body = c.req.valid('json')

    const result = await db
      .insert(customers)
      .values({
        firstName: body.first_name,
        middleName: body.middle_name,
        lastName: body.last_name,
        phone: body.phone,
        houseNo: body.house_no,
        streetName: body.street_name,
        city: body.city,
        zipCode: body.zip_code,
        creditLimit: body.credit_limit,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning()

    return c.json(
      {
        status: 'success',
        data: result[0]
      },
      201
    )
  }
)

/**
 * GET /customers/:customer
 */
customerRoutes.get('/:customer', async c => {
  const id = Number(c.req.param('customer'))

  const customer = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .get()

  if (!customer) {
    return c.json({ message: 'Customer not found' }, 404)
  }

  return c.json({
    status: 'success',
    data: customer
  })
})

/**
 * PUT /customers/:customer
 */
customerRoutes.put(
  '/:customer',
  zValidator('json', schemas.UpdateCustomerRequest),
  async c => {
    const id = Number(c.req.param('customer'))
    const body = c.req.valid('json')

    const result = await db
      .update(customers)
      .set({
        ...body,
        updatedAt: new Date().toISOString()
      })
      .where(eq(customers.id, id))
      .returning()

    return c.json({
      status: 'success',
      data: result[0]
    })
  }
)

/**
 * DELETE /customers/:customer
 */
customerRoutes.delete('/:customer', async c => {
  const id = Number(c.req.param('customer'))

  await db.delete(customers).where(eq(customers.id, id))

  return c.json({ status: 'success', data: null })
})
