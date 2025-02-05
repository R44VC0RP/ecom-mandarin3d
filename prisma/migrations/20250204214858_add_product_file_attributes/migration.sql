-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "slicedFileAttributes" JSONB,
ADD COLUMN     "slicedFileUrl" TEXT;
