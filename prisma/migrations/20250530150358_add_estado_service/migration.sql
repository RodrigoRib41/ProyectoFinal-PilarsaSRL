/*
  Warnings:

  - Added the required column `fechaHoraProgramada` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'Pendiente',
ADD COLUMN     "fechaHoraProgramada" TIMESTAMP(3) NOT NULL;
