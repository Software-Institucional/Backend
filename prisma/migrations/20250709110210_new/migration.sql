-- CreateTable
CREATE TABLE "SedeNivel" (
    "id" STRING NOT NULL,
    "sedeId" STRING NOT NULL,
    "nivelId" STRING NOT NULL,

    CONSTRAINT "SedeNivel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SedeNivel" ADD CONSTRAINT "SedeNivel_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SedeNivel" ADD CONSTRAINT "SedeNivel_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
