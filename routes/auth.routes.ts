// import { Hono } from 'hono';
// import { zValidator } from '@hono/zod-validator';
// import { schemas } from '../zod/apiSchema.json.client';
// import { db } from '../db';
// import { users, customers } from '../db/schema';
// import { eq } from 'drizzle-orm';
// import { hash, verify } from 'bun';

// export const authRoutes = new Hono();

// // POST /auth/register
// authRoutes.post('/register', zValidator('json', schemas.RegisterRequest), async (c) => {
//     const body = c.req.valid('json');

//     const existingUser = await db.select().from(users).where(eq(users.email, body.email)).get();
//     if(existingUser){
//         return c.json({ message: 'Email already in use' }, 409);
//     }
    
//     const hashedPassword = await hash(body.password);
    
//     const newUser = await db.insert(users).values({
//         name: body.name,
//         email: body.email,
//         role: 'customer',
//         password: hashedPassword,
//     }).returning();

//     await db.insert(customers).values({
//         firstName: body.first_name,
//         middleName: body.middle_name,
//         lastName: body.last_name,
//         phone: body.phone,
//         houseNo: body.house_no,
//         streetName: body.street_name,
//         city: body.city,
//         zipCode: body.zip_code,
//         userId: newUser[0].id,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//     }).run();

//     return c.json({
//         status: 'success',
//         message: 'User registered successfully'
//     }, 201);
// });

// // POST /auth/login
// authRoutes.post('/login', zValidator('json', schemas.LoginRequest), async (c) => {
//     const { email, password } = c.req.valid('json');
    
//     const user = await db.select().from(users).where(eq(users.email, email)).get();
//     if (!user) {
//         return c.json({ status: 'error', message: 'Invalid credentials.' }, 401);
//     }

//     const isPasswordValid = await verify(password, user.password);
//     if (!isPasswordValid) {
//         return c.json({ status: 'error', message: 'Invalid credentials.' }, 401);
//     }

//     const customer = await db.select().from(customers).where(eq(customers.userId, user.id)).get();

//     return c.json({
//         status: 'success',
//         data: {a
//             user: { id: user.id, name: user.name, email: user.email, role: user.role },
//             customer: customer,
//             token: 'sample-jwt-token', // In a real app, you would generate a JWT here.
//         },
//     });
// });

// // POST /auth/logout
// authRoutes.post('/logout', (c) => {
//   // In a real app, you would invalidate the token.
//   return c.json({
//     status: 'success',
//     data: null,
//   });
// });

// // GET /auth/me
// authRoutes.get('/me', (c) => {
//   // In a real app, you'd get the user from the authentication middleware.
//   // For now, returning the first user as a placeholder.
//   // const user = await db.select().from(users).get();
//   // const customer = await db.select().from(customers).where(eq(customers.userId, user.id)).get();
  
//   return c.json({
//     status: 'success',
//     data: { // placeholder data
//         user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'customer' },
//         customer: { id: 1, firstName: 'Test', middleName: 'Q', lastName: 'User', houseNo: '123', streetName: 'Main St', city: 'Anytown', zipCode: '12345', phone: '555-1234', creditLimit: 1000, userId: 1, createdAt: '', updatedAt: '' },
//     },
//   });
// });
