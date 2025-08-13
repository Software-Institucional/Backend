/*
  Warnings:

  - Added the required column `Zone` to the `Sede` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calendar` to the `Sede` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sede" ADD COLUMN     "Zone" STRING NOT NULL;
ALTER TABLE "Sede" ADD COLUMN     "active" BOOL NOT NULL DEFAULT true;
ALTER TABLE "Sede" ADD COLUMN     "calendar" STRING NOT NULL;
