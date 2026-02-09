import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { schemas } from '../zod/apiSchema.json.client';
import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';

export const productRoutes = new Hono();

// GET /products
productRoutes.get('/', async (c) => {
    const data = await db.select().from(products);
    return c.json({
        status: 'success',
        data: data,
    });
});

// POST /products
productRoutes.post('/', zValidator('json', schemas.StoreProductRequest), async (c) => {
    const body = c.req.valid('json');
    const result = await db.insert(products).values({
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }).returning();

    return c.json({
        status: 'success',
        data: result[0],
    }, 201);
});

// GET /products/:product
productRoutes.get('/:product', async (c) => {
    const id = Number(c.req.param('product'));
    const product = await db.select().from(products).where(eq(products.id, id)).get();

    if (!product) {
        return c.json({ message: 'Product not found' }, 404);
    }

    return c.json({
        status: 'success',
        data: product,
    });
});

// PUT /products/:product
productRoutes.put('/:product', zValidator('json', schemas.UpdateProductRequest), async (c) => {
    const id = Number(c.req.param('product'));
    const body = c.req.valid('json');
    const result = await db.update(products).set({
        ...body,
        updatedAt: new Date().toISOString(),
    }).where(eq(products.id, id)).returning();

    return c.json({
        status: 'success',
        data: result[0],
    });
});

// DELETE /products/:product
productRoutes.delete('/:product', async (c) => {
    const id = Number(c.req.param('product'));
    await db.delete(products).where(eq(products.id, id));
    return c.json({ status: 'success', data: null }, 204);
});
