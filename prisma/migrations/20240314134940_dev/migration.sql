/*
  Warnings:

  - Added the required column `subscriptionTier` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "subscriptionTier" "subscriptionTier" NOT NULL;
