
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// User table from auth.me response
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  // password hash should be stored, not the plain password. RegisterRequest has password.
  password: text('password').notNull(),
  role: text('role').notNull().default('customer'),
});

// Customer table from CustomerResource
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  middleName: text('middle_name'),
  lastName: text('last_name').notNull(),
  // Flatten address
  houseNo: text('house_no').notNull(),
  streetName: text('street_name').notNull(),
  city: text('city').notNull(),
  zipCode: text('zip_code').notNull(),
  phone: text('phone').notNull(),
  creditLimit: real('credit_limit').notNull().default(0),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
  userId: integer('user_id').references(() => users.id)
});

// Product table from ProductResource
export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    costPrice: real('costPrice').notNull(),
    sellPrice: real('sellPrice').notNull(),
    currentQuantity: integer('currentQuantity').notNull(),
    reorderLevel: integer('reorderLevel').notNull(),
    reorderQuantity: integer('reorderQuantity').notNull(),
    // images is an array of strings. For a DB schema, this could be a separate table or JSON string.
    // I'll use JSON string stored as text as it's simpler.
    images: text('images', { mode: 'json' }).$type<string[]>(),
    createdAt: text('created_at'),
    updatedAt: text('updated_at'),
});

// Order table from OrderResource
export const orders = sqliteTable('orders', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    customerID: integer('customerID').notNull().references(() => customers.id),
    totalPrice: real('totalPrice').notNull(),
    dueDate: text('dueDate').notNull(),
    orderStatus: text('orderStatus', { enum: ['pending', 'processing', 'completed', 'cancelled'] }).notNull(),
    isPaid: integer('isPaid', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at'),
    updatedAt: text('updated_at'),
});

// OrderItem table from OrderItemResource
export const orderItems = sqliteTable('orderItems', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderID: integer('orderID').notNull().references(() => orders.id),
    productID: integer('productID').notNull().references(() => products.id),
    quantity: integer('quantity').notNull(),
    itemTotalPrice: real('itemTotalPrice').notNull(),
    deliveryStatus: text('deliveryStatus', { enum: ['pending', 'delivered'] }).notNull(),
    createdAt: text('created_at'),
    updatedAt: text('updated_at'),
});

// RedeemCode table
export const redeemCodes = sqliteTable('redeemCodes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    code: text('code').notNull().unique(),
    amount: real('amount').notNull(),
    usedAt: text('usedAt'),
    usedByCustomerID: integer('usedByCustomerID').references(() => customers.id),
});

// ReorderNotice table from ReorderNotice
export const reorderNotices = sqliteTable('reorderNotices', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    productID: integer('productID').notNull().references(() => products.id),
    productName: text('productName').notNull(),
    reorderQuantity: integer('reorderQuantity').notNull(),
    currentQuantity: integer('currentQuantity').notNull(),
    isResolved: integer('isResolved', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at'),
    updatedAt: text('updated_at'),
});


