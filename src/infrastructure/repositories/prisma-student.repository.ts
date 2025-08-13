import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Students } from '@prisma/client'; // Prisma types
import {
  EstadoAlumnoSIMAT,
  FichaAlumno,
} from '../services/get-students-simat.service';
import { StudentRepository } from 'src/domain/repositories/student.repository';

@Injectable()
export class PrismaStudentRepository implements StudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveFichaAlumno(
    data: FichaAlumno,
  ): Promise<{ created: boolean; updated: boolean; id: string }> {
    // Conversión segura de fecha (dd/mm/yyyy)
    let fechaNacimiento: Date | undefined = undefined;
    if (
      data.fechaNacimiento &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(data.fechaNacimiento)
    ) {
      const [day, month, year] = data.fechaNacimiento.split('/');
      fechaNacimiento = new Date(Number(year), Number(month) - 1, Number(day));
    }

    // Buscar estudiante por documento
    const estudiante: Students | null = await this.prisma.students.findUnique({
      where: { numero: data.numero },
    });

    if (!estudiante) {
      // Crear nuevo estudiante
      const created = await this.prisma.students.create({
        data: {
          tipoID: data.tipoID,
          numero: data.numero,
          primerNombre: data.primerNombre,
          segundoNombre: data.segundoNombre ?? '',
          primerApellido: data.primerApellido,
          segundoApellido: data.segundoApellido ?? '',
          genero: data.genero,
          fechaNacimiento: fechaNacimiento!,
          direccionResidencia: data.direccionResidencia ?? '',
          barrioResidencia: data.barrioResidencia ?? '',
          deptResidencia: data.deptResidencia ?? '',
          munResidencia: data.munResidencia ?? '',
          zona: data.zona ?? '',
          telefono: data.telefono ?? '',
          email: data.email ?? '',
          sisbenIV: data.sisbenIV ?? '',
          sisbenIVCat: data.sisbenIVCat ?? '',
          estrato: data.estrato ?? '',
          rh: data.rh ?? '',
          epsAfiliado: data.epsAfiliado ?? '',
          etnia: data.etnia ?? '',
          victimaConflicto:
            (data.victimaConflicto?.toUpperCase() || 'NO') === 'SI',
          madreCabeza: (data.madreCabeza?.toUpperCase() || 'NO') === 'SI',
          beneficiarioHeroe:
            (data.beneficiarioHeroe?.toUpperCase() || 'NO') === 'SI',
          nacionalidad: data.paisOrigen ?? '',
          especialidad: data.especialidad ?? '',
          // Agrega aquí otros campos si tu modelo lo requiere
        },
      });

      // Familiares
      if (data.familiares && data.familiares.length > 0) {
        await this.prisma.familiar.createMany({
          data: data.familiares.map((f) => ({
            estudianteId: created.id,
            nombre: f.familiar,
            parentesco: f.parentesco,
            acudiente: (f.acudiente?.toUpperCase() || 'NO') === 'S',
            tipoDocumento: f.tipoDocumento,
            documento: f.documento,
            telefono: f.telefono ?? '',
            correo: f.correo ?? '',
          })),
        });
      }

      return { created: true, updated: false, id: created.id };
    }

    // Campos a actualizar solo si cambiaron
    const updatedFields: Partial<Students> = {};

    if (estudiante.tipoID !== data.tipoID) updatedFields.tipoID = data.tipoID;
    if (estudiante.primerNombre !== data.primerNombre)
      updatedFields.primerNombre = data.primerNombre;
    if (estudiante.segundoNombre !== (data.segundoNombre ?? ''))
      updatedFields.segundoNombre = data.segundoNombre ?? '';
    if (estudiante.primerApellido !== data.primerApellido)
      updatedFields.primerApellido = data.primerApellido;
    if (estudiante.segundoApellido !== (data.segundoApellido ?? ''))
      updatedFields.segundoApellido = data.segundoApellido ?? '';
    if (estudiante.genero !== data.genero) updatedFields.genero = data.genero;
    if (
      fechaNacimiento &&
      estudiante.fechaNacimiento &&
      estudiante.fechaNacimiento.toISOString().slice(0, 10) !==
        fechaNacimiento.toISOString().slice(0, 10)
    ) {
      updatedFields.fechaNacimiento = fechaNacimiento;
    }
    if (estudiante.direccionResidencia !== (data.direccionResidencia ?? ''))
      updatedFields.direccionResidencia = data.direccionResidencia ?? '';
    if (estudiante.barrioResidencia !== (data.barrioResidencia ?? ''))
      updatedFields.barrioResidencia = data.barrioResidencia ?? '';
    if (estudiante.deptResidencia !== (data.deptResidencia ?? ''))
      updatedFields.deptResidencia = data.deptResidencia ?? '';
    if (estudiante.munResidencia !== (data.munResidencia ?? ''))
      updatedFields.munResidencia = data.munResidencia ?? '';
    if (estudiante.zona !== (data.zona ?? ''))
      updatedFields.zona = data.zona ?? '';
    if (estudiante.telefono !== (data.telefono ?? ''))
      updatedFields.telefono = data.telefono ?? '';
    if (estudiante.email !== (data.email ?? ''))
      updatedFields.email = data.email ?? '';
    if (estudiante.sisbenIV !== (data.sisbenIV ?? ''))
      updatedFields.sisbenIV = data.sisbenIV ?? '';
    if (estudiante.sisbenIVCat !== (data.sisbenIVCat ?? ''))
      updatedFields.sisbenIVCat = data.sisbenIVCat ?? '';
    if (estudiante.estrato !== (data.estrato ?? ''))
      updatedFields.estrato = data.estrato ?? '';
    if (estudiante.rh !== (data.rh ?? '')) updatedFields.rh = data.rh ?? '';
    if (estudiante.epsAfiliado !== (data.epsAfiliado ?? ''))
      updatedFields.epsAfiliado = data.epsAfiliado ?? '';
    if (estudiante.etnia !== (data.etnia ?? ''))
      updatedFields.etnia = data.etnia ?? '';
    if (
      (estudiante.victimaConflicto ? 'SI' : 'NO') !==
      (data.victimaConflicto?.toUpperCase() || 'NO')
    )
      updatedFields.victimaConflicto =
        (data.victimaConflicto?.toUpperCase() || 'NO') === 'SI';
    if (
      (estudiante.madreCabeza ? 'SI' : 'NO') !==
      (data.madreCabeza?.toUpperCase() || 'NO')
    )
      updatedFields.madreCabeza =
        (data.madreCabeza?.toUpperCase() || 'NO') === 'SI';
    if (
      (estudiante.beneficiarioHeroe ? 'SI' : 'NO') !==
      (data.beneficiarioHeroe?.toUpperCase() || 'NO')
    )
      updatedFields.beneficiarioHeroe =
        (data.beneficiarioHeroe?.toUpperCase() || 'NO') === 'SI';
    if (estudiante.nacionalidad !== (data.paisOrigen ?? ''))
      updatedFields.nacionalidad = data.paisOrigen ?? '';
    if (estudiante.especialidad !== (data.especialidad ?? ''))
      updatedFields.especialidad = data.especialidad ?? '';

    let wasUpdated = false;
    if (Object.keys(updatedFields).length > 0) {
      await this.prisma.students.update({
        where: { id: estudiante.id },
        data: updatedFields,
      });
      wasUpdated = true;
    }

    // Familiares (limpia y recrea siempre por robustez)
    await this.prisma.familiar.deleteMany({
      where: { estudianteId: estudiante.id },
    });
    if (data.familiares && data.familiares.length > 0) {
      await this.prisma.familiar.createMany({
        data: data.familiares.map((f) => ({
          estudianteId: estudiante.id,
          nombre: f.familiar,
          parentesco: f.parentesco,
          acudiente: (f.acudiente?.toUpperCase() || 'NO') === 'S',
          tipoDocumento: f.tipoDocumento,
          documento: f.documento,
          telefono: f.telefono ?? '',
          correo: f.correo ?? '',
        })),
      });
    }

    return { created: false, updated: wasUpdated, id: estudiante.id };
  }

  async saveMatriculaEstadoSimat(
    estado: EstadoAlumnoSIMAT,
    estudianteId: string,
  ): Promise<{ created: boolean; updated: boolean; id: string }> {
    // Busca año académico activo
    const yearNum = parseInt(estado.anoEstado, 10);

    if (!Number.isFinite(yearNum)) {
      throw new Error(`Año inválido en estado: "${estado.anoEstado}"`);
    }
    const academicYear = await this.prisma.academicYear.findFirst({
      where: {
        active: true,
        year: yearNum,
      },
    });
    if (!academicYear) throw new Error('Año académico no encontrado');

    const sede = await this.prisma.sede.findFirst({
      where: {
        name: {
          contains: estado.sede,
          mode: 'insensitive', // para que no importe mayúsculas/minúsculas
        },
        active: true,
      },
    });
    const sedeGrado = await this.prisma.gradoSede.findFirst({
      where: { sedeId: sede?.id },
    });

    // Busca el salón
    const salon = await this.prisma.salones.findFirst({
      where: {
        codeOfficial: parseInt(estado.grupo.replace(':', '').trim(), 10),
        activo: true,
      },
    });
    if (!salon) throw new Error('Salón/curso no encontrado');

    // Busca matrícula existente
    let enrollment = await this.prisma.enrollment.findFirst({
      where: { estudianteId, yearId: academicYear.id },
    });

    if (!enrollment) {
      enrollment = await this.prisma.enrollment.create({
        data: {
          estudianteId,
          salonId: salon.id,
          yearId: academicYear.id,
          status: estado.estadoActual,
          sedeId: sede?.id,
          gradoSedeId: sedeGrado?.id,

          // Agrega aquí otros campos si los agregas al modelo Enrollment
          // motivo: estado.motivo, metodologia: estado.metodologia, etc.
        },
      });
      return { created: true, updated: false, id: enrollment.id };
    } else {
      const updateData: { salonId: string; status: string } = {
        salonId: salon.id,
        status: estado.estadoActual,
        // Agrega aquí otros campos si es necesario, con sus tipos correctos
      };
      await this.prisma.enrollment.update({
        where: { id: enrollment.id },
        data: updateData,
      });
      return { created: false, updated: true, id: enrollment.id };
    }
  }
}
