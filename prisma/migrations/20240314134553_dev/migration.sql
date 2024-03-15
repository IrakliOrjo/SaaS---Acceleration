/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `Company` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "subscriptionId";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
