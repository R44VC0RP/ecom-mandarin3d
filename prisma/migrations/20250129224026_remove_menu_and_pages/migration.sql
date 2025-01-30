/*
  Warnings:

  - You are about to drop the column `pageId` on the `SEO` table. All the data in the column will be lost.
  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_menuId_fkey";

-- DropForeignKey
ALTER TABLE "SEO" DROP CONSTRAINT "SEO_pageId_fkey";

-- DropIndex
DROP INDEX "SEO_pageId_key";

-- AlterTable
ALTER TABLE "SEO" DROP COLUMN "pageId";

-- DropTable
DROP TABLE "Menu";

-- DropTable
DROP TABLE "MenuItem";

-- DropTable
DROP TABLE "Page";
