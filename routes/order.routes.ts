import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { schemas } from '../zod/apiSchema.json.client';
import { db } from '../db';
import { orders, orderItems } from '../db/schema';
import { eq } from 'drizzle-orm';

export const orderRoutes = new Hono();

// GET /orders
orderRoutes.get('/', async (c) => {
    const data = await db.select().from(orders);
    return c.json({
        status: 'success',
        data: {
            // This is not a paginated response anymore.
            // The zod schema expects a paginator. For now, returning raw data.
            data: data,
        },
    });
});

// POST /orders
orderRoutes.post('/', zValidator('json', schemas.StoreOrderRequest), async (c) => {
    const body = c.req.valid('json');
    
    // In a real app, you'd calculate the total price based on the items.
    // Here we'll just use a placeholder.
    const totalPrice = body.items.reduce((acc, item) => acc + (item.quantity * 10), 0); // a sample price

    const newOrder = await db.insert(orders).values({
        customerID: body.customerID,
        dueDate: body.dueDate,
        totalPrice: totalPrice,
        orderStatus: 'pending',
        isPaid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }).returning();

    for (const item of body.items) {
        await db.insert(orderItems).values({
            orderID: newOrder[0].id,
            productID: item.productID,
            quantity: item.quantity,
            itemTotalPrice: item.quantity * 10, // sample price
            deliveryStatus: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }).run();
    }

    return c.json({
        status: 'success',
        data: newOrder[0],
    }, 201);
});

// GET /orders/:order
orderRoutes.get('/:order', async (c) => {
    const id = Number(c.req.param('order'));
    const order = await db.select().from(orders).where(eq(orders.id, id)).get();

    if (!order) {
        return c.json({ message: 'Order not found' }, 404);
    }

    const items = await db.select().from(orderItems).where(eq(orderItems.orderID, id));

    return c.json({
        status: 'success',
        data: { ...order, items },
    });
});

// PUT /orders/:order
orderRoutes.put('/:order', zValidator('json', schemas.UpdateOrderRequest), async (c) => {
    const id = Number(c.req.param('order'));
    const body = c.req.valid('json');
    const result = await db.update(orders).set({
        ...body,
        updatedAt: new Date().toISOString(),
    }).where(eq(orders.id, id)).returning();

    return c.json({
        status: 'success',
        data: result[0],
    });
});

// DELETE /orders/:order
orderRoutes.delete('/:order', async (c) => {
    const id = Number(c.req.param('order'));
    // Also delete order items
    await db.delete(orderItems).where(eq(orderItems.orderID, id));
    await db.delete(orders).where(eq(orders.id, id));
    return c.json({ status: 'success', data: null }, 204);
});

// POST /orders/:order/cancel
orderRoutes.post('/:order/cancel', async (c) => {
    const id = Number(c.req.param('order'));
    const result = await db.update(orders).set({
        orderStatus: 'cancelled',
        updatedAt: new Date().toISOString(),
    }).where(eq(orders.id, id)).returning();
    
    return c.json({
        status: 'success',
        data: result[0],
    });
});
