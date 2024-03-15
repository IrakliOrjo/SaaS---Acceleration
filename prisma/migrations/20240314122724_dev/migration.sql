/*
  Warnings:

  - You are about to drop the column `rules` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `maxFilesPerMonth` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMembers` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "bill" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "rules",
ADD COLUMN     "maxFilesPerMonth" INTEGER NOT NULL,
ADD COLUMN     "maxMembers" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
