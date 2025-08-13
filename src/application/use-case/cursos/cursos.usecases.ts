import { Inject, Injectable } from '@nestjs/common';
import {
  CreateCursoDto,
  CursoResponseDto,
  UpdateCursoDto,
} from 'src/application/dtos/cursos.dto';
import { CursoRepository } from 'src/domain/repositories/curso.repository';

@Injectable()
export class CreateCursoUseCase {
  constructor(
    @Inject('CursoRepository') private readonly repo: CursoRepository,
  ) {}

  async execute(
    gradoSedeId: string,
    dto: CreateCursoDto,
  ): Promise<CursoResponseDto> {
    const curso = await this.repo.createCurso(
      gradoSedeId,
      dto.name,
      dto.codeOfficial,
    );
    return { ...curso };
  }
}

@Injectable()
export class ListCursosByGradoSedeUseCase {
  constructor(
    @Inject('CursoRepository') private readonly repo: CursoRepository,
  ) {}

  async execute(gradoSedeId: string): Promise<CursoResponseDto[]> {
    const cursos = await this.repo.findByGradoSede(gradoSedeId);
    return cursos.map((c) => ({ ...c }));
  }
}

@Injectable()
export class UpdateCursoUseCase {
  constructor(
    @Inject('CursoRepository') private readonly repo: CursoRepository,
  ) {}

  async execute(id: string, dto: UpdateCursoDto): Promise<CursoResponseDto> {
    const curso = await this.repo.updateCurso(id, dto);
    return { ...curso };
  }
}

@Injectable()
export class DeleteCursoUseCase {
  constructor(
    @Inject('CursoRepository') private readonly repo: CursoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.repo.deleteCurso(id);
  }
}
