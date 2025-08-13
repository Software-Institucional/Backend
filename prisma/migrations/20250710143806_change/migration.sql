-- DropForeignKey
ALTER TABLE "Familiar" DROP CONSTRAINT "Familiar_estudianteId_fkey";

-- AddForeignKey
ALTER TABLE "Familiar" ADD CONSTRAINT "Familiar_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
