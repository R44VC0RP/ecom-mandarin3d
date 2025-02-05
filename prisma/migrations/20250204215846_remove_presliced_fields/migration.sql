/*
  Warnings:

  - You are about to drop the column `slicedFileAttributes` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `slicedFileUrl` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "slicedFileAttributes",
DROP COLUMN "slicedFileUrl";
