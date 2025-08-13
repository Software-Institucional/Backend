/*
  Warnings:

  - You are about to drop the column `nombre` on the `Nivel` table. All the data in the column will be lost.
  - Added the required column `name` to the `Nivel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nivel" DROP COLUMN "nombre";
ALTER TABLE "Nivel" ADD COLUMN     "name" STRING NOT NULL;
