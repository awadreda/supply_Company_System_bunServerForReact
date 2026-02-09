import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { schemas } from '../zod/apiSchema.json.client';
import { db } from '../db';
import { orderItems } from '../db/schema';
import { eq } from 'drizzle-orm';

export const orderItemRoutes = new Hono();

// GET /order-items
orderItemRoutes.get('/', async (c) => {
    const data = await db.select().from(orderItems);
    return c.json({
        status: 'success',
        data: data,
    });
});

// GET /order-items/:orderItem
orderItemRoutes.get('/:orderItem', async (c) => {
    const id = Number(c.req.param('orderItem'));
    const item = await db.select().from(orderItems).where(eq(orderItems.id, id)).get();

    if (!item) {
        return c.json({ message: 'Order item not found' }, 404);
    }

    return c.json({
        status: 'success',
        data: item,
    });
});

// PUT /order-items/:orderItem
orderItemRoutes.put('/:orderItem', zValidator('json', schemas.UpdateOrderItemRequest), async (c) => {
    const id = Number(c.req.param('orderItem'));
    const body = c.req.valid('json');
    const result = await db.update(orderItems).set({
        ...body,
        updatedAt: new Date().toISOString(),
    }).where(eq(orderItems.id, id)).returning();

    return c.json({
        status: 'success',
        data: result[0],
    });
});
