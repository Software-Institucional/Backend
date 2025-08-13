/*
  Warnings:

  - You are about to drop the column `name` on the `Nivel` table. All the data in the column will be lost.
  - You are about to drop the column `sedeId` on the `Nivel` table. All the data in the column will be lost.
  - You are about to drop the `AcademicYear` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Period` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectOnCourse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nombre` to the `Nivel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_nivelId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_yearId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_estudianteId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_yearId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_periodId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_subjectOnCourseId_fkey";

-- DropForeignKey
ALTER TABLE "Nivel" DROP CONSTRAINT "Nivel_sedeId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectOnCourse" DROP CONSTRAINT "SubjectOnCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectOnCourse" DROP CONSTRAINT "SubjectOnCourse_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectOnCourse" DROP CONSTRAINT "SubjectOnCourse_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectOnCourse" DROP CONSTRAINT "SubjectOnCourse_yearId_fkey";

-- AlterTable
ALTER TABLE "Nivel" DROP COLUMN "name";
ALTER TABLE "Nivel" DROP COLUMN "sedeId";
ALTER TABLE "Nivel" ADD COLUMN     "nombre" STRING NOT NULL;

-- DropTable
DROP TABLE "AcademicYear";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "Grade";

-- DropTable
DROP TABLE "Period";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "SubjectOnCourse";

-- CreateTable
CREATE TABLE "SedeNivel" (
    "id" STRING NOT NULL,
    "sedeId" STRING NOT NULL,
    "nivelId" STRING NOT NULL,

    CONSTRAINT "SedeNivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradoSedeNivel" (
    "id" STRING NOT NULL,
    "sedeNivelId" STRING NOT NULL,
    "gradoId" STRING NOT NULL,
    "activo" BOOL NOT NULL DEFAULT true,

    CONSTRAINT "GradoSedeNivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grado" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "nivelId" STRING NOT NULL,

    CONSTRAINT "Grado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salon" (
    "id" STRING NOT NULL,
    "nombre" STRING NOT NULL,
    "gradoSedeNivelId" STRING NOT NULL,

    CONSTRAINT "Salon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SedeNivel" ADD CONSTRAINT "SedeNivel_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SedeNivel" ADD CONSTRAINT "SedeNivel_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradoSedeNivel" ADD CONSTRAINT "GradoSedeNivel_sedeNivelId_fkey" FOREIGN KEY ("sedeNivelId") REFERENCES "SedeNivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradoSedeNivel" ADD CONSTRAINT "GradoSedeNivel_gradoId_fkey" FOREIGN KEY ("gradoId") REFERENCES "Grado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grado" ADD CONSTRAINT "Grado_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salon" ADD CONSTRAINT "Salon_gradoSedeNivelId_fkey" FOREIGN KEY ("gradoSedeNivelId") REFERENCES "GradoSedeNivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
