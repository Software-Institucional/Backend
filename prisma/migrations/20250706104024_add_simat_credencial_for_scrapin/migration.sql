/*
  Warnings:

  - You are about to drop the column `simatusers` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "simatusers";
ALTER TABLE "User" ADD COLUMN     "simatuser" STRING;
