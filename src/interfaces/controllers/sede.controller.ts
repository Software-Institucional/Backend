import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  SedesDtoRequest,
  SedesDtoResponse,
} from 'src/application/dtos/sedes.dtos';
import { CreateSedeUseCase } from 'src/application/use-case/sede/create-sede.use-case';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

@Controller('sedes')
export class SedeController {
  constructor(private readonly createSedeUseCase: CreateSedeUseCase) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'created sedes' })
  @ApiResponse({
    status: 200,
    description: 'List of registered users',
    type: SedesDtoResponse,
  })
  async create(
    @Body() sedesDtoResponse: SedesDtoRequest,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<SedesDtoResponse> {
    sedesDtoResponse.user = req.user;
    return this.createSedeUseCase.execute(sedesDtoResponse);
  }
}
