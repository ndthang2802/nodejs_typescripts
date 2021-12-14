CREATE TYPE "products_status" AS ENUM (
  'out_of_stock',
  'in_stock',
  'running_low'
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "full_name" varchar,
  "created_at" timestamp,
  "phone_number" varchar,
  "username" varchar,
  "password" varchar
);

CREATE TABLE "order_items" (
  "id" uuid PRIMARY KEY,
  "order_id" uuid,
  "product_id" uuid,
  "quantity" int DEFAULT 1
);

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid UNIQUE NOT NULL,
  "status" varchar,
  "created_at" varchar
);

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY,
  "name" varchar,
  "merchant_id" uuid NOT NULL,
  "price" int,
  "status" products_status,
  "created_at" time DEFAULT (now())
);

CREATE TABLE "merchants" (
  "id" uuid PRIMARY KEY,
  "merchant_name" varchar,
  "created_at" varchar,
  "admin_id" uuid
);

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "merchants" ADD FOREIGN KEY ("admin_id") REFERENCES "users" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("merchant_id") REFERENCES "merchants" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

CREATE INDEX "product_status" ON "products" ("merchant_id", "status");

CREATE UNIQUE INDEX ON "products" ("id");

COMMENT ON COLUMN "users"."phone_number" IS 'follow phone format';

COMMENT ON COLUMN "orders"."created_at" IS 'When order created';
