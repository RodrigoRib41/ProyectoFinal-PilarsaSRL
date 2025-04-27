/*
  Warnings:

  - You are about to drop the column `fotos` on the `Auto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auto" DROP COLUMN "fotos",
ADD COLUMN     "foto1" TEXT,
ADD COLUMN     "foto2" TEXT,
ADD COLUMN     "foto3" TEXT,
ADD COLUMN     "foto4" TEXT;
