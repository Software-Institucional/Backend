import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateGradoSedeDto } from 'src/application/dtos/grado-sede';
import { CreateCustomGradoSedeUseCase } from 'src/application/use-case/grado/create-custom-grado.use-case';
import { DeleteGradoSedeUseCase } from 'src/application/use-case/grado/delete-grado-sede-use-case';
import { InitGradosSedeNivelUseCase } from 'src/application/use-case/grado/init-grados-sede-nivel.use-case';
import { ListGradosSedeNivelUseCase } from 'src/application/use-case/grado/list-grados-sede.use-case';
import { SetActivoGradoSedeUseCase } from 'src/application/use-case/grado/set-activo-grado-sede.use-case';

@Controller('sedes/:sedeId/niveles/:nivelId/grados')
export class GradoSedeController {
  constructor(
    private readonly initGrados: InitGradosSedeNivelUseCase,
    private readonly createCustom: CreateCustomGradoSedeUseCase,
    private readonly list: ListGradosSedeNivelUseCase,
    private readonly setActivos: SetActivoGradoSedeUseCase,
    private readonly del: DeleteGradoSedeUseCase,
  ) {}

  @Post('init')
  @ApiOperation({
    summary: 'necesitas que le copie automáticamente los grados globales',
  })
  async init(
    @Param('sedeId') sedeId: string,
    @Param('nivelId') nivelId: string,
  ) {
    return this.initGrados.execute(sedeId, nivelId);
  }

  @Get()
  @ApiOperation({ summary: 'lista de grados de ese nivel en la sede.' })
  async listAll(
    @Param('sedeId') sedeId: string,
    @Param('nivelId') nivelId: string,
  ) {
    return this.list.execute(sedeId, nivelId);
  }

  @Post()
  @ApiOperation({
    summary: 'Crea un nuevo grado personalizado en la sede y nivel.',
  })
  async create(
    @Param('sedeId') sedeId: string,
    @Param('nivelId') nivelId: string,
    @Body() body: CreateGradoSedeDto,
  ) {
    return this.createCustom.execute(sedeId, nivelId, body.name);
  }

  @Patch(':gradoSedeId')
  @ApiOperation({
    summary:
      'Edita propiedades del grado en la sede (por ejemplo, cambiar el nombre, activar/desactivar)',
  })
  async setActivo(
    @Param('gradoSedeId') gradoSedeId: string,
    @Body() dto: { name?: string; activo?: boolean },
  ) {
    return this.setActivos.execute(gradoSedeId, dto);
  }

  @Delete(':gradoSedeId')
  async delOne(@Param('gradoSedeId') gradoSedeId: string) {
    return this.del.execute(gradoSedeId);
  }
}
