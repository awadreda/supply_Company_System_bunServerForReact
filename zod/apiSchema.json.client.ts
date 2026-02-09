import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core'
import { z } from 'zod'

const RegisterRequest = z
  .object({
    name: z.string().max(255),
    email: z.string().max(255).email(),
    password: z.string().min(8),
    first_name: z.string().max(255),
    middle_name: z.string().max(255),
    last_name: z.string().max(255),
    house_no: z.string().max(50),
    street_name: z.string().max(255),
    city: z.string().max(100),
    zip_code: z.string().max(20),
    phone: z.string().max(20),
    password_confirmation: z.string().min(8)
  })
  .passthrough()
const LoginRequest = z
  .object({ email: z.string().email(), password: z.string() })
  .passthrough()
const CustomerResource = z
  .object({
    customerID: z.number().int(),
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
    address: z
      .object({
        house_no: z.string(),
        street_name: z.string(),
        city: z.string(),
        zip_code: z.string()
      })
      .passthrough(),
    phone: z.string(),
    credit_limit: z.string(),
    created_at: z.union([z.string(), z.null()]),
    updated_at: z.union([z.string(), z.null()])
  })
  .passthrough()
const StoreCustomerRequest = z
  .object({
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
    phone: z.string(),
    house_no: z.string(),
    street_name: z.string(),
    city: z.string(),
    zip_code: z.string(),
    credit_limit: z.number().gte(0)
  })
  .passthrough()
const UpdateCustomerRequest = z
  .object({
    first_name: z.string().max(255),
    middle_name: z.string().max(255),
    last_name: z.string().max(255),
    house_no: z.string().max(50),
    street_name: z.string().max(255),
    city: z.string().max(100),
    zip_code: z.string().max(20),
    phone: z.string().max(20),
    credit_limit: z.number().gte(0)
  })
  .partial()
  .passthrough()
const makeLengthAwarePaginator = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z
    .object({
      current_page: z.number().int(),
      data: z.array(itemSchema),
      first_page_url: z.string(),
      from: z.union([z.number(), z.null()]),
      last_page: z.number().int(),
      last_page_url: z.string(),
      links: z.object({}).partial().passthrough(),
      next_page_url: z.union([z.string(), z.null()]),
      path: z.union([z.string(), z.null()]),
      per_page: z.number().int(),
      prev_page_url: z.union([z.string(), z.null()]),
      to: z.union([z.number(), z.null()]),
      total: z.number().int()
    })
    .passthrough()
const StoreOrderRequest = z
  .object({
    customerID: z.number().int(),
    dueDate: z.string().datetime({ offset: true }),
    items: z
      .array(
        z
          .object({
            productID: z.number().int(),
            quantity: z.number().int().gte(1)
          })
          .passthrough()
      )
      .min(1)
  })
  .passthrough()
const OrderStatus = z.enum(['pending', 'processing', 'completed', 'cancelled'])
const DeliveryStatus = z.enum(['pending', 'delivered'])
const ProductResource = z
  .object({
    productID: z.number().int(),
    name: z.string(),
    description: z.string(),
    costPrice: z.string(),
    sellPrice: z.string(),
    currentQuantity: z.number().int(),
    reorderLevel: z.number().int(),
    reorderQuantity: z.number().int(),
    images: z.array(z.string()),
    created_at: z.union([z.string(), z.null()]),
    updated_at: z.union([z.string(), z.null()])
  })
  .passthrough()
const OrderItemResource = z
  .object({
    orderItemID: z.number().int(),
    orderID: z.number().int(),
    productID: z.number().int(),
    quantity: z.number().int(),
    itemTotalPrice: z.string(),
    deliveryStatus: DeliveryStatus,
    created_at: z.union([z.string(), z.null()]),
    updated_at: z.union([z.string(), z.null()]),
    product: ProductResource.optional()
  })
  .passthrough()
const OrderResource = z
  .object({
    orderID: z.number().int(),
    customerID: z.number().int(),
    totalPrice: z.string(),
    dueDate: z.string(),
    orderStatus: OrderStatus,
    isPaid: z.boolean(),
    created_at: z.union([z.string(), z.null()]),
    updated_at: z.union([z.string(), z.null()]),
    customer: CustomerResource.optional(),
    items: z.array(OrderItemResource).optional()
  })
  .passthrough()
const UpdateOrderRequest = z
  .object({
    dueDate: z.string().datetime({ offset: true }),
    isPaid: z.boolean()
  })
  .partial()
  .passthrough()
const UpdateOrderItemRequest = z
  .object({ deliveryStatus: DeliveryStatus })
  .passthrough()
const StoreProductRequest = z
  .object({
    name: z.string(),
    description: z.string(),
    costPrice: z.number().gte(0),
    sellPrice: z.number(),
    currentQuantity: z.number().int().gte(0),
    reorderLevel: z.number().int().gte(1),
    reorderQuantity: z.number().int(),
    images: z.union([z.array(z.instanceof(File)), z.null()]).optional()
  })
  .passthrough()
const UpdateProductRequest = z
  .object({
    name: z.string().max(255),
    description: z.string(),
    costPrice: z.number().gte(0),
    sellPrice: z.number().gte(0),
    currentQuantity: z.number().int().gte(0),
    reorderLevel: z.number().int().gte(1),
    reorderQuantity: z.number().int().gte(1),
    images: z.union([z.array(z.instanceof(File)), z.null()])
  })
  .partial()
  .passthrough()
const StoreRedeemCodeRequest = z
  .object({ code: z.string().optional(), amount: z.number().gte(1) })
  .passthrough()
const RedeemCodeRequest = z
  .object({ customerID: z.number().int(), code: z.string() })
  .passthrough()
const ReorderNotice = z
  .object({
    id: z.number().int(),
    productID: z.number().int(),
    productName: z.string(),
    reorderQuantity: z.number().int(),
    currentQuantity: z.number().int(),
    isResolved: z.boolean(),
    created_at: z.union([z.string(), z.null()]),
    updated_at: z.union([z.string(), z.null()])
  })
  .passthrough()

export const schemas = {
  RegisterRequest,
  LoginRequest,
  CustomerResource,
  StoreCustomerRequest,
  UpdateCustomerRequest,
  StoreOrderRequest,
  OrderStatus,
  DeliveryStatus,
  ProductResource,
  OrderItemResource,
  OrderResource,
  UpdateOrderRequest,
  UpdateOrderItemRequest,
  StoreProductRequest,
  UpdateProductRequest,
  StoreRedeemCodeRequest,
  RedeemCodeRequest,
  ReorderNotice
}

const endpoints = makeApi([
  {
    method: 'post',
    path: '/auth/login',
    alias: 'auth.login',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: LoginRequest
      }
    ],
    response: z
      .object({
        status: z.literal('success'),
        data: z
          .object({
            user: z
              .object({
                id: z.number().int(),
                name: z.string(),
                email: z.string(),
                role: z.string()
              })
              .passthrough(),
            customer: z.union([CustomerResource, z.null()]),
            token: z.string()
          })
          .passthrough()
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        schema: z
          .object({
            status: z.literal('error'),
            message: z.literal('Invalid credentials.')
          })
          .passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string().min(2).max(100)))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'post',
    path: '/auth/logout',
    alias: 'auth.logout',
    requestFormat: 'json',
    response: z
      .object({ status: z.literal('success'), data: z.null() })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/auth/me',
    alias: 'auth.me',
    requestFormat: 'json',
    response: z
      .object({
        status: z.literal('success'),
        data: z
          .object({
            user: z
              .object({
                id: z.number().int(),
                name: z.string(),
                email: z.string(),
                role: z.string()
              })
              .passthrough(),
            customer: z.union([CustomerResource, z.null()])
          })
          .passthrough()
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'post',
    path: '/auth/register',
    alias: 'auth.register',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: RegisterRequest
      }
    ],
    response: z.object({}).partial().passthrough(),
    errors: [
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string()))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/customers',
    alias: 'customers.index',
    requestFormat: 'json',
    response: z
      .object({ status: z.literal('success'), data: z.array(CustomerResource) })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'post',
    path: '/customers',
    alias: 'customers.store',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: StoreCustomerRequest
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: CustomerResource })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string()
            // errors: z.record(z.array(z.string())),
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/customers/:customer',
    alias: 'customers.show',
    requestFormat: 'json',
    parameters: [
      {
        name: 'customer',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: CustomerResource })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'put',
    path: '/customers/:customer',
    alias: 'customers.update',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: UpdateCustomerRequest
      },
      {
        name: 'customer',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: CustomerResource })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string()))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'delete',
    path: '/customers/:customer',
    alias: 'customers.destroy',
    requestFormat: 'json',
    parameters: [
      {
        name: 'customer',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: z.null() })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/order-items',
    alias: 'order-items.index',
    requestFormat: 'json',
    response: z
      .object({
        status: z.literal('success'),
        data: z.array(OrderItemResource)
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/order-items/:orderItem',
    alias: 'order-items.show',
    requestFormat: 'json',
    parameters: [
      {
        name: 'orderItem',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: OrderItemResource })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'put',
    path: '/order-items/:orderItem',
    alias: 'order-items.update',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: UpdateOrderItemRequest
      },
      {
        name: 'orderItem',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: OrderItemResource })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string()))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/orders',
    alias: 'order.index',
    requestFormat: 'json',
    response: z
      .object({
        status: z.literal('success'),
        data: makeLengthAwarePaginator(OrderResource)
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 403,
        schema: z
          .object({
            status: z.literal('error'),
            message: z.literal('No customer profile linked to this account.')
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'post',
    path: '/orders',
    alias: 'order.store',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: StoreOrderRequest
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: OrderResource })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 403,
        schema: z
          .object({
            status: z.literal('error'),
            message: z.literal('Only customers can place orders.')
          })
          .passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string()))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/orders/:order',
    alias: 'order.show',
    requestFormat: 'json',
    parameters: [
      {
        name: 'order',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z.union([
      z
        .object({ status: z.literal('success'), data: OrderResource })
        .passthrough(),
      z.null()
    ]),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 403,
        schema: z
          .object({
            status: z.literal('error'),
            message: z.literal('Forbidden.')
          })
          .passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'put',
    path: '/orders/:order',
    alias: 'order.update',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: UpdateOrderRequest
      },
      {
        name: 'order',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z.union([
      z
        .object({ status: z.literal('success'), data: OrderResource })
        .passthrough(),
      z.null()
    ]),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 403,
        schema: z
          .object({
            status: z.literal('error'),
            message: z.literal('Forbidden.')
          })
          .passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string()))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'delete',
    path: '/orders/:order',
    alias: 'order.destroy',
    requestFormat: 'json',
    parameters: [
      {
        name: 'order',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z.union([
      z
        .object({
          status: z.literal('success'),
          message: z.literal('Order deleted successfully')
        })
        .passthrough(),
      z.null()
    ]),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 403,
        schema: z
          .object({
            status: z.literal('error'),
            message: z.literal('Forbidden.')
          })
          .passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'post',
    path: '/orders/:order/cancel',
    alias: 'order.cancel',
    requestFormat: 'json',
    parameters: [
      {
        name: 'order',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z.object({}).partial().passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/products',
    alias: 'product.index',
    requestFormat: 'json',
    response: z
      .object({ status: z.literal('success'), data: z.array(ProductResource) })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'post',
    path: '/products',
    alias: 'product.store',
    requestFormat: 'form-data',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: StoreProductRequest
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: ProductResource })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string()))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/products/:product',
    alias: 'product.show',
    requestFormat: 'json',
    parameters: [
      {
        name: 'product',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: ProductResource })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'put',
    path: '/products/:product',
    alias: 'product.update',
    requestFormat: 'form-data',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: UpdateProductRequest
      },
      {
        name: 'product',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: ProductResource })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string()))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'delete',
    path: '/products/:product',
    alias: 'product.destroy',
    requestFormat: 'json',
    parameters: [
      {
        name: 'product',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z
      .object({
        status: z.literal('success'),
        message: z.literal('Product deleted successfully')
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'post',
    path: '/redeem-codes',
    alias: 'redeemCode.store',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: StoreRedeemCodeRequest
      }
    ],
    response: z
      .object({
        status: z.literal('success'),
        data: z.object({ code: z.string(), amount: z.string() }).passthrough()
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string()))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'post',
    path: '/redeem-codes/redeem',
    alias: 'redeemCode.redeem',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: RedeemCodeRequest
      }
    ],
    response: z
      .object({
        status: z.literal('success'),
        data: z
          .object({
            code: z.string(),
            amount: z.string(),
            usedAt: z.union([z.string(), z.null()]),
            usedByCustomerID: z.union([z.number(), z.null()])
          })
          .passthrough()
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 403,
        schema: z
          .object({
            status: z.literal('error'),
            message: z.literal('No customer profile linked to this account.')
          })
          .passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 422,
        description: `Validation error`,
        schema: z
          .object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string()))
          })
          .passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/reorder-notices',
    alias: 'reorderNotice.index',
    requestFormat: 'json',
    response: z
      .object({
        status: z.literal('success'),
        data: makeLengthAwarePaginator(ReorderNotice)
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  },
  {
    method: 'get',
    path: '/reorder-notices/:reorderNotice',
    alias: 'reorderNotice.show',
    requestFormat: 'json',
    parameters: [
      {
        name: 'reorderNotice',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z
      .object({ status: z.literal('success'), data: ReorderNotice })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthenticated`,
        schema: z.object({ message: z.string() }).passthrough()
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.object({ message: z.string() }).passthrough()
      }
    ]
  }
])

export const api = new Zodios(endpoints)

export function createApiClient (baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options)
}
