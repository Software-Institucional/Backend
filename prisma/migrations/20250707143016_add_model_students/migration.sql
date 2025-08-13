-- CreateTable
CREATE TABLE "Students" (
    "id" STRING NOT NULL,
    "tipoID" STRING NOT NULL,
    "numero" STRING NOT NULL,
    "primerNombre" STRING NOT NULL,
    "segundoNombre" STRING,
    "primerApellido" STRING NOT NULL,
    "segundoApellido" STRING,
    "genero" STRING NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "direccionResidencia" STRING,
    "barrioResidencia" STRING,
    "deptResidencia" STRING,
    "munResidencia" STRING,
    "zona" STRING,
    "telefono" STRING,
    "email" STRING,
    "sisbenIV" STRING,
    "sisbenIVCat" STRING,
    "estrato" STRING,
    "rh" STRING,
    "epsAfiliado" STRING,
    "etnia" STRING,
    "victimaConflicto" BOOL DEFAULT false,
    "madreCabeza" BOOL DEFAULT false,
    "beneficiarioHeroe" BOOL DEFAULT false,
    "nacionalidad" STRING,
    "especialidad" STRING,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Familiar" (
    "id" STRING NOT NULL,
    "estudianteId" STRING NOT NULL,
    "nombre" STRING NOT NULL,
    "parentesco" STRING NOT NULL,
    "acudiente" BOOL NOT NULL,
    "tipoDocumento" STRING NOT NULL,
    "documento" STRING NOT NULL,
    "telefono" STRING,
    "correo" STRING,

    CONSTRAINT "Familiar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nivel" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "sedeId" STRING NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "nivelId" STRING NOT NULL,
    "yearId" STRING NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" STRING NOT NULL,
    "year" INT4 NOT NULL,
    "active" BOOL NOT NULL DEFAULT false,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" STRING NOT NULL,
    "estudianteId" STRING NOT NULL,
    "cursoId" STRING NOT NULL,
    "yearId" STRING NOT NULL,
    "status" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectOnCourse" (
    "id" STRING NOT NULL,
    "subjectId" STRING NOT NULL,
    "courseId" STRING NOT NULL,
    "yearId" STRING NOT NULL,
    "teacherId" STRING,

    CONSTRAINT "SubjectOnCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "order" INT4 NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" STRING NOT NULL,
    "enrollmentId" STRING NOT NULL,
    "subjectOnCourseId" STRING NOT NULL,
    "periodId" STRING NOT NULL,
    "value" FLOAT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Students_numero_key" ON "Students"("numero");

-- AddForeignKey
ALTER TABLE "Familiar" ADD CONSTRAINT "Familiar_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nivel" ADD CONSTRAINT "Nivel_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectOnCourse" ADD CONSTRAINT "SubjectOnCourse_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectOnCourse" ADD CONSTRAINT "SubjectOnCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectOnCourse" ADD CONSTRAINT "SubjectOnCourse_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectOnCourse" ADD CONSTRAINT "SubjectOnCourse_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_subjectOnCourseId_fkey" FOREIGN KEY ("subjectOnCourseId") REFERENCES "SubjectOnCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
