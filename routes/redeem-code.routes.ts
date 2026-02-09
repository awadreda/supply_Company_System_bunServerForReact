import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { schemas } from '../zod/apiSchema.json.client';
import { db } from '../db';
import { redeemCodes, customers } from '../db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export const redeemCodeRoutes = new Hono();

// POST /redeem-codes
redeemCodeRoutes.post('/', zValidator('json', schemas.StoreRedeemCodeRequest), async (c) => {
    const body = c.req.valid('json');
    const code = body.code || randomBytes(8).toString('hex');
    
    const result = await db.insert(redeemCodes).values({
        code: code,
        amount: body.amount,
    }).returning();

    return c.json({
        status: 'success',
        data: result[0],
    }, 201);
});

// POST /redeem-codes/redeem
redeemCodeRoutes.post('/redeem', zValidator('json', schemas.RedeemCodeRequest), async (c) => {
    const body = c.req.valid('json');

    const code = await db.select().from(redeemCodes).where(and(eq(redeemCodes.code, body.code), isNull(redeemCodes.usedAt))).get();

    if (!code) {
        return c.json({ message: 'Code not found or already used' }, 404);
    }

    const customer = await db.select().from(customers).where(eq(customers.id, body.customerID)).get();
    if(!customer){
        return c.json({ message: 'Customer not found' }, 404);
    }
    
    await db.update(customers).set({ creditLimit: (customer.creditLimit || 0) + code.amount }).where(eq(customers.id, body.customerID));
    
    const updatedCode = await db.update(redeemCodes).set({
        usedAt: new Date().toISOString(),
        usedByCustomerID: body.customerID,
    }).where(eq(redeemCodes.id, code.id)).returning();


    return c.json({
        status: 'success',
        data: updatedCode[0],
    });
});
