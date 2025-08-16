import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  CreateCursoDto,
  CursoResponseDto,
  UpdateCursoDto,
} from 'src/application/dtos/cursos.dto';
import {
  CreateCursoUseCase,
  DeleteCursoUseCase,
  ListCursosByGradoSedeUseCase,
  UpdateCursoUseCase,
} from 'src/application/use-case/cursos/cursos.usecases';

@Controller('curso')
export class CursoController {
  constructor(
    private readonly createCurso: CreateCursoUseCase,
    private readonly listCursos: ListCursosByGradoSedeUseCase,
    private readonly updateCurso: UpdateCursoUseCase,
    private readonly deleteCurso: DeleteCursoUseCase,
  ) {}

  @Post(':gradoSedeId')
  @ApiOperation({
    summary: 'Crea un nuevo curso (salón) en ese grado de la sede.',
  })
  async create(
    @Param('gradoSedeId') gradoSedeId: string,
    @Body() dto: CreateCursoDto,
  ): Promise<CursoResponseDto> {
    return this.createCurso.execute(gradoSedeId, dto);
  }

  @Get(':gradoSedeId')
  @ApiOperation({
    summary: 'Devuelve todos los cursos de ese grado en esa sede.',
  })
  async list(
    @Param('gradoSedeId') gradoSedeId: string,
  ): Promise<CursoResponseDto[]> {
    return this.listCursos.execute(gradoSedeId);
  }

  @Patch(':cursoId')
  @ApiOperation({
    summary: 'Editar nombre del curso, Desactivar (eliminar lógico) el curso',
  })
  async update(@Param('cursoId') cursoId: string, @Body() dto: UpdateCursoDto) {
    return this.updateCurso.execute(cursoId, dto);
  }

  @Delete(':cursoId')
  @ApiOperation({
    summary: 'Eliminar curso',
  })
  async delete(@Param('cursoId') cursoId: string) {
    await this.deleteCurso.execute(cursoId);
    return { message: 'Curso eliminado' };
  }
}
