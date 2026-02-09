import { Hono } from 'hono';
// import { authRoutes } from './auth.routes';
import { customerRoutes } from './customer.routes';
import { orderRoutes } from './order.routes';
import { orderItemRoutes } from './order-item.routes';
import { productRoutes } from './product.routes';
import { redeemCodeRoutes } from './redeem-code.routes';
import { reorderNoticeRoutes } from './reorder-notice.routes';

const api = new Hono();

// api.route('/auth', authRoutes);
api.route('/customers', customerRoutes);
api.route('/orders', orderRoutes);
api.route('/order-items', orderItemRoutes);
api.route('/products', productRoutes);
api.route('/redeem-codes', redeemCodeRoutes);
api.route('/reorder-notices', reorderNoticeRoutes);

export const v1 = api;
