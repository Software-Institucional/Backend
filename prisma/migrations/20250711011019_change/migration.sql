/*
  Warnings:

  - You are about to drop the column `cursoId` on the `Enrollment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "cursoId";
ALTER TABLE "Enrollment" ADD COLUMN     "gradoSedeId" STRING;
ALTER TABLE "Enrollment" ADD COLUMN     "salonId" STRING;
ALTER TABLE "Enrollment" ADD COLUMN     "sedeId" STRING;
ALTER TABLE "Enrollment" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_gradoSedeId_fkey" FOREIGN KEY ("gradoSedeId") REFERENCES "GradoSede"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE SET NULL ON UPDATE CASCADE;
