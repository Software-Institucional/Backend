import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { studentSearch } from 'src/application/dtos/student';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { SimatService } from 'src/infrastructure/services/get-students-simat.service';
import * as CryptoJS from 'crypto-js';
import { StudentRepository } from 'src/domain/repositories/student.repository';

@Injectable()
export class ConsultarFichaAlumnoUseCase {
  private readonly logger = new Logger(ConsultarFichaAlumnoUseCase.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('StudentRepository')
    private readonly studentRepo: StudentRepository,
    private readonly simatService: SimatService,
  ) {}

  async execute(dto: studentSearch) {
    const userId = dto.user.sub;

    if (!userId) {
      throw new Error('User not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.role !== 'SUPER' && user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'No tienes permiso para Consultar la ficha de un estudiante',
      );
    }

    const AES_SECRET = process.env.AES_SECRET || 'CLAVE-SECRETA-DEMO';

    if (!user.simatuser || !user.simatpass) {
      throw new UnauthorizedException(
        'No tienes credenciales SIMAT configuradas',
      );
    }
    const simatuser = CryptoJS.AES.decrypt(user.simatuser, AES_SECRET).toString(
      CryptoJS.enc.Utf8,
    );
    const simatpass = CryptoJS.AES.decrypt(user.simatpass, AES_SECRET).toString(
      CryptoJS.enc.Utf8,
    );

    // 1. Obtener ficha de SIMAT
    const { ficha, estado } = await this.simatService.extraerFichaYEstadoAlumno(
      {
        documento: dto.documento,
        simatuser,
        simatpass,
      },
    );

    // 2. Guardar/actualizar en tu BD
    const { id: estudianteId } = await this.studentRepo.saveFichaAlumno(ficha);

    // Guardar matrícula/estado SIMAT
    await this.studentRepo.saveMatriculaEstadoSimat(estado, estudianteId);

    // 3. Retornar la ficha
    return {
      ...ficha,
      estado,
    };
  }
}
