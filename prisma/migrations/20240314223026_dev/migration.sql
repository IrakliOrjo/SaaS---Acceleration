/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Coworker` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Coworker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Coworker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Coworker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coworker" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Coworker_email_key" ON "Coworker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_companyId_key" ON "Subscription"("companyId");
