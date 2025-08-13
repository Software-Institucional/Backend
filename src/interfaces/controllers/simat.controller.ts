import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { studentSearch } from 'src/application/dtos/student';
import { ConsultarFichaAlumnoUseCase } from 'src/application/use-case/student/consultar-ficha-alumno.use-case';

import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { SimatService } from 'src/infrastructure/services/get-students-simat.service';

@Controller('simat')
export class SimatController {
  constructor(
    private readonly ConsultEstudent: ConsultarFichaAlumnoUseCase,
    private readonly simatService: SimatService,
  ) {}

  @Post('student')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getStudentData(@Body() students: studentSearch, @Req() req: Request) {
    students.user = req.user as studentSearch['user'];

    return await this.ConsultEstudent.execute(students);
    // return this.simatService.extraerFichaAlumno(body);
  }
}
