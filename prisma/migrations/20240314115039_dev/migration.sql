/*
  Warnings:

  - The `rules` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "rules",
ADD COLUMN     "rules" INTEGER[];
