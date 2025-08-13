/*
  Warnings:

  - You are about to drop the `Curso` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_gradoSedeId_fkey";

-- DropTable
DROP TABLE "Curso";

-- CreateTable
CREATE TABLE "Salones" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "codeOfficial" INT4 NOT NULL,
    "gradoSedeId" STRING NOT NULL,
    "activo" BOOL NOT NULL DEFAULT true,

    CONSTRAINT "Salones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Salones" ADD CONSTRAINT "Salones_gradoSedeId_fkey" FOREIGN KEY ("gradoSedeId") REFERENCES "GradoSede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
