import { Hono } from 'hono';
import { db } from '../db';
import { reorderNotices } from '../db/schema';
import { eq } from 'drizzle-orm';

export const reorderNoticeRoutes = new Hono();

// GET /reorder-notices
reorderNoticeRoutes.get('/', async (c) => {
    const data = await db.select().from(reorderNotices);
    return c.json({
        status: 'success',
        data: {
            data: data
        }
    });
});

// GET /reorder-notices/:reorderNotice
reorderNoticeRoutes.get('/:reorderNotice', async (c) => {
    const id = Number(c.req.param('reorderNotice'));
    const notice = await db.select().from(reorderNotices).where(eq(reorderNotices.id, id)).get();

    if (!notice) {
        return c.json({ message: 'Reorder notice not found' }, 404);
    }

    return c.json({
        status: 'success',
        data: notice,
    });
});
