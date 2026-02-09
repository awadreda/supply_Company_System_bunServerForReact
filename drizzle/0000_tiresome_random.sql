CREATE TABLE [users] (
	[id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[name] nvarchar(255) NOT NULL,
	[email] nvarchar(255) NOT NULL,
	[password] nvarchar(255) NOT NULL,
	[role] nvarchar(50) DEFAULT 'customer' NOT NULL
);
--> statement-breakpoint

CREATE TABLE [customers] (
	[id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[first_name] nvarchar(255) NOT NULL,
	[middle_name] nvarchar(255),
	[last_name] nvarchar(255) NOT NULL,
	[house_no] nvarchar(255) NOT NULL,
	[street_name] nvarchar(255) NOT NULL,
	[city] nvarchar(255) NOT NULL,
	[zip_code] nvarchar(50) NOT NULL,
	[phone] nvarchar(50) NOT NULL,
	[credit_limit] float DEFAULT 0 NOT NULL,
	[created_at] datetime,
	[updated_at] datetime,
	[user_id] int,
	FOREIGN KEY ([user_id]) REFERENCES [users]([id]) ON UPDATE NO ACTION ON DELETE NO ACTION
);
--> statement-breakpoint

CREATE TABLE [products] (
	[id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[name] nvarchar(255) NOT NULL,
	[description] nvarchar(max),
	[costPrice] float NOT NULL,
	[sellPrice] float NOT NULL,
	[currentQuantity] int NOT NULL,
	[reorderLevel] int NOT NULL,
	[reorderQuantity] int NOT NULL,
	[images] nvarchar(max),
	[created_at] datetime,
	[updated_at] datetime
);
--> statement-breakpoint

CREATE TABLE [orders] (
	[id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[customerID] int NOT NULL,
	[totalPrice] float NOT NULL,
	[dueDate] datetime NOT NULL,
	[orderStatus] nvarchar(100) NOT NULL,
	[isPaid] bit DEFAULT 0 NOT NULL,
	[created_at] datetime,
	[updated_at] datetime,
	FOREIGN KEY ([customerID]) REFERENCES [customers]([id]) ON UPDATE NO ACTION ON DELETE NO ACTION
);
--> statement-breakpoint

CREATE TABLE [orderItems] (
	[id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[orderID] int NOT NULL,
	[productID] int NOT NULL,
	[quantity] int NOT NULL,
	[itemTotalPrice] float NOT NULL,
	[deliveryStatus] nvarchar(100) NOT NULL,
	[created_at] datetime,
	[updated_at] datetime,
	FOREIGN KEY ([orderID]) REFERENCES [orders]([id]) ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ([productID]) REFERENCES [products]([id]) ON UPDATE NO ACTION ON DELETE NO ACTION
);
--> statement-breakpoint

CREATE TABLE [redeemCodes] (
	[id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[code] nvarchar(100) NOT NULL,
	[amount] float NOT NULL,
	[usedAt] datetime,
	[usedByCustomerID] int,
	FOREIGN KEY ([usedByCustomerID]) REFERENCES [customers]([id]) ON UPDATE NO ACTION ON DELETE NO ACTION
);
--> statement-breakpoint

CREATE UNIQUE INDEX redeemCodes_code_unique ON [redeemCodes] ([code]);--> statement-breakpoint

CREATE TABLE [reorderNotices] (
	[id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[productID] int NOT NULL,
	[productName] nvarchar(255) NOT NULL,
	[reorderQuantity] int NOT NULL,
	[currentQuantity] int NOT NULL,
	[isResolved] bit DEFAULT 0 NOT NULL,
	[created_at] datetime,
	[updated_at] datetime,
	FOREIGN KEY ([productID]) REFERENCES [products]([id]) ON UPDATE NO ACTION ON DELETE NO ACTION
);
--> statement-breakpoint

CREATE UNIQUE INDEX users_email_unique ON [users] ([email]);