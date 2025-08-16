import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  SedesDtoRequest,
  SedesDtoResponse,
} from 'src/application/dtos/sedes.dtos';
import { Sede } from 'src/domain/entities/sede/sede.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { SedeRepository } from 'src/domain/repositories/sede.repository';

@Injectable()
export class CreateSedeUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,

    @Inject('SedeRepository') private readonly sedeRepository: SedeRepository,
  ) {}

  async execute(request: SedesDtoRequest): Promise<SedesDtoResponse> {
    const userId = request.user.sub;

    if (!userId) {
      throw new Error('User not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.role !== 'SUPER' && user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'No tienes permiso para crear un colegio',
      );
    }

    const niveles = request.niveles.map((id) => ({ id, name: '' }));
    const sede = new Sede(
      randomUUID(),
      request.name,
      request.schoolId,
      request.calendar,
      request.Zone,
      request.active,
      request.address,
      request.phone,
      request.codeDANE,
      new Date(),
      new Date(),
      undefined, // school
      niveles, // <-- array de objetos { id, name }
    );
    let createdSede: Sede;
    try {
      createdSede = await this.sedeRepository.createSede(sede);
    } catch (error) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'P2003' || err.code === 'FOREIGN_KEY_CONSTRAINT') {
        throw new UnauthorizedException(
          'El colegio especificado no existe o es inválido.',
        );
      }
      if (
        err.code === 'P2002' ||
        (err.message && err.message.includes('Unique constraint failed'))
      ) {
        throw new UnauthorizedException('Ya existe una sede con ese nombre.');
      }
      throw new UnauthorizedException('No se pudo crear la sede.');
    }

    return {
      id: createdSede.id,
      name: createdSede.name,
      codeDANE: createdSede.name,
      address: createdSede.address,
      phone: createdSede.phone,
      schoolId: createdSede.schoolId,
      calendar: createdSede.calendar,
      Zone: createdSede.Zone,
      active: createdSede.active,
    };
  }
}
