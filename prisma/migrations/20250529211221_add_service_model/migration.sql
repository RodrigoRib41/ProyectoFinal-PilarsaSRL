/*
  Warnings:

  - Added the required column `domicilioCliente` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreCliente` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefonoCliente` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "domicilioCliente" TEXT NOT NULL,
ADD COLUMN     "nombreCliente" TEXT NOT NULL,
ADD COLUMN     "telefonoCliente" TEXT NOT NULL;
