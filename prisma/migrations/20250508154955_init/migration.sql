-- CreateEnum
CREATE TYPE "Region" AS ENUM ('North', 'South', 'East', 'West', 'Central', 'Northeast');

-- CreateEnum
CREATE TYPE "WebsiteStatus" AS ENUM ('active', 'inactive', 'pending');

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategories" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pincodes" (
    "id" SERIAL NOT NULL,
    "pincode" VARCHAR(10) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'India',
    "region" "Region",
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pincodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website" (
    "id" BIGSERIAL NOT NULL,
    "website_id" INTEGER NOT NULL,
    "website_name" VARCHAR(150) NOT NULL,
    "website_url" VARCHAR(255) NOT NULL,
    "logo_url" VARCHAR(255),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "WebsiteStatus" NOT NULL DEFAULT 'active',
    "category_id" INTEGER NOT NULL,
    "category_name" VARCHAR(100) NOT NULL,
    "category_slug" VARCHAR(100) NOT NULL,
    "subcategory_id" INTEGER NOT NULL,
    "subcategory_name" VARCHAR(100) NOT NULL,
    "subcategory_slug" VARCHAR(100) NOT NULL,
    "pincode" VARCHAR(10) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,

    CONSTRAINT "website_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "idx_category_active_order" ON "categories"("is_active", "display_order");

-- CreateIndex
CREATE INDEX "idx_subcategory_category" ON "subcategories"("category_id");

-- CreateIndex
CREATE INDEX "idx_subcategory_active_order" ON "subcategories"("is_active", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "subcategories_category_id_slug_key" ON "subcategories"("category_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "pincodes_pincode_key" ON "pincodes"("pincode");

-- CreateIndex
CREATE INDEX "idx_pincodes_city" ON "pincodes"("city");

-- CreateIndex
CREATE INDEX "idx_pincodes_state" ON "pincodes"("state");

-- CreateIndex
CREATE INDEX "idx_pincodes_active" ON "pincodes"("is_active");

-- CreateIndex
CREATE INDEX "idx_pincodes_location" ON "pincodes"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "idx_status_pincode" ON "website"("status", "pincode");

-- CreateIndex
CREATE INDEX "idx_cat_pincode" ON "website"("category_id", "pincode", "status");

-- CreateIndex
CREATE INDEX "idx_subcat_pincode" ON "website"("subcategory_id", "pincode", "status");

-- CreateIndex
CREATE UNIQUE INDEX "website_website_id_subcategory_id_pincode_key" ON "website"("website_id", "subcategory_id", "pincode");

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website" ADD CONSTRAINT "website_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website" ADD CONSTRAINT "website_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website" ADD CONSTRAINT "website_pincode_fkey" FOREIGN KEY ("pincode") REFERENCES "pincodes"("pincode") ON DELETE RESTRICT ON UPDATE CASCADE;
