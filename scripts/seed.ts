import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Niveles
  const niveles = [
    { name: 'PREESCOLAR' },
    { name: 'BÁSICA PRIMARIA' },
    { name: 'BÁSICA SECUNDARIA' },
    { name: 'MEDIA' },
  ];

  // Insertar niveles
  const nivelRecords: Record<string, { id: string; name: string }> = {};
  for (const nivel of niveles) {
    let record = await prisma.nivel.findFirst({
      where: { name: nivel.name },
    });

    if (!record) {
      record = await prisma.nivel.create({
        data: { name: nivel.name },
      });
    }

    nivelRecords[nivel.name] = { id: record.id, name: record.name };
  }

  // Grados por nivel
  const gradosPorNivel: Record<string, string[]> = {
    PREESCOLAR: [
      'JARDIN I / KINDER (-1)',
      'PRE-JARDIN (-2)',
      'JARDIN II / TRANSICIÓN (0)',
    ],
    'BÁSICA PRIMARIA': ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO'],
    'BÁSICA SECUNDARIA': ['SEXTO', 'SEPTIMO', 'OCTAVO', 'NOVENO'],
    MEDIA: ['DÉCIMO', 'ONCE', 'DOCE'],
  };

  // Insertar grados
  for (const [nivelNombre, grados] of Object.entries(gradosPorNivel)) {
    const nivelId = nivelRecords[nivelNombre].id;
    for (const gradoNombre of grados) {
      const existingGrado = await prisma.grado.findFirst({
        where: {
          name: gradoNombre,
          nivelId: nivelId,
        },
      });

      if (!existingGrado) {
        await prisma.grado.create({
          data: {
            name: gradoNombre,
            nivelId: nivelId,
          },
        });
      }
    }
  }

  console.log('Niveles y grados estándar insertados correctamente.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    // prisma.$disconnect();
    process.exit(1);
  });
