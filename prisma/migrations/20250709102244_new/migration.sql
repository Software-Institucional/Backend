/*
  Warnings:

  - You are about to drop the column `custom` on the `Grado` table. All the data in the column will be lost.
  - You are about to drop the column `sedeId` on the `Grado` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Sede` table. All the data in the column will be lost.
  - You are about to drop the `GradoSedeNivel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Salon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SedeNivel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GradoSedeNivel" DROP CONSTRAINT "GradoSedeNivel_gradoId_fkey";

-- DropForeignKey
ALTER TABLE "GradoSedeNivel" DROP CONSTRAINT "GradoSedeNivel_sedeNivelId_fkey";

-- DropForeignKey
ALTER TABLE "Salon" DROP CONSTRAINT "Salon_gradoSedeNivelId_fkey";

-- DropForeignKey
ALTER TABLE "SedeNivel" DROP CONSTRAINT "SedeNivel_nivelId_fkey";

-- DropForeignKey
ALTER TABLE "SedeNivel" DROP CONSTRAINT "SedeNivel_sedeId_fkey";

-- AlterTable
ALTER TABLE "Grado" DROP COLUMN "custom";
ALTER TABLE "Grado" DROP COLUMN "sedeId";

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "codeDANE" STRING;

-- AlterTable
ALTER TABLE "Sede" DROP COLUMN "userId";
ALTER TABLE "Sede" ADD COLUMN     "codeDANE" STRING;

-- DropTable
DROP TABLE "GradoSedeNivel";

-- DropTable
DROP TABLE "Salon";

-- DropTable
DROP TABLE "SedeNivel";

-- CreateTable
CREATE TABLE "GradoSede" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "sedeId" STRING NOT NULL,
    "nivelId" STRING NOT NULL,
    "gradoId" STRING,
    "activo" BOOL NOT NULL DEFAULT true,
    "custom" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "GradoSede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" STRING NOT NULL,
    "nombre" STRING NOT NULL,
    "gradoSedeId" STRING NOT NULL,
    "activo" BOOL NOT NULL DEFAULT true,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GradoSede" ADD CONSTRAINT "GradoSede_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradoSede" ADD CONSTRAINT "GradoSede_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradoSede" ADD CONSTRAINT "GradoSede_gradoId_fkey" FOREIGN KEY ("gradoId") REFERENCES "Grado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_gradoSedeId_fkey" FOREIGN KEY ("gradoSedeId") REFERENCES "GradoSede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
