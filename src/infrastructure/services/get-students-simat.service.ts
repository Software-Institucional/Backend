import { Injectable, Logger } from '@nestjs/common';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';
import { PrismaService } from '../prisma/prisma.service';

export interface FichaAlumno {
  codigoUnico: string;
  fechaEstado: string;
  estadoAlumno: string;
  paisOrigen: string;
  tipoID: string;
  numero: string;
  deptExpedicion: string;
  munExpedicion: string;
  genero: string;
  fechaNacimiento: string;
  deptNacimiento: string;
  munNacimiento: string;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  segundoNombre: string;
  direccionResidencia: string;
  barrioResidencia: string;
  deptResidencia: string;
  munResidencia: string;
  zona: string;
  telefono: string;
  email: string;
  caracter: string;
  especialidad: string;
  matriculaContratada: string;
  contrato: string;
  estrategias: string[];
  fechasInicio: string[];
  fechasFin: string[];
  epsAfiliado: string;
  ipsAsignada: string;
  rh: string;
  arsAfiliado: string;
  victimaConflicto: string;
  sisbenIV: string;
  sisbenIVCat: string;
  carnetSisben: string;
  estrato: string;
  fuenteRecursos: string;
  madreCabeza: string;
  beneficiarioHijoMadreCabeza: string;
  beneficiarioVeterano: string;
  beneficiarioHeroe: string;
  resguardo: string;
  etnia: string;
  discapacidad: string[];
  discapacidadSeleccionada: string[];
  capacidades: string[];
  trastornoAprendizaje: string;
  apoyoAcademico: string;
  srpa: string;
  familiares: Array<{
    familiar: string;
    parentesco: string;
    acudiente: string;
    tipoDocumento: string;
    documento: string;
    telefono: string;
    correo: string;
  }>;
}

export interface EstadoAlumnoSIMAT {
  secretaria: string;
  jerarquia: string;
  anoEstado: string;
  estadoActual: string;
  fechaInicialEstado: string;
  institucion: string;
  sede: string;
  jornada: string;
  metodologia: string;
  grado: string;
  grupo: string;
  caracter: string;
  especialidad: string;
  motivo: string;
  residenciaEscolar: string;
}

@Injectable()
export class SimatService {
  private readonly logger = new Logger(SimatService.name);
  private browser: Browser | undefined;
  private context: BrowserContext | undefined;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
  }

  async onModuleDestroy() {
    if (this.browser) await this.browser.close();
  }

  private async getValue(page: Page, selector: string): Promise<string> {
    try {
      const el = await page.$(selector);
      if (!el) return '';
      if ((await el.getAttribute('type')) === 'checkbox')
        return (await el.isChecked()) ? 'SI' : 'NO';
      return ((await el.inputValue()) || '').trim();
    } catch {
      return '';
    }
  }

  private async getSelectText(page: Page, selector: string): Promise<string> {
    try {
      const selected = await page.$(`${selector} option[selected]`);
      if (selected) return (await selected.innerText()).trim();
      const select = await page.$(selector);
      if (select) {
        const value = await select.inputValue();
        const opt = await page.$(`${selector} option[value="${value}"]`);
        if (opt) return (await opt.innerText()).trim();
      }
      return '';
    } catch {
      return '';
    }
  }

  private async extraerEstadoActualPorDiv(
    page: Page,
  ): Promise<EstadoAlumnoSIMAT> {
    // Localiza la tabla correcta (la interna)
    const tablaLocator = page.locator(
      '//td[contains(@class,"regionDiv") and contains(text(),"Estado Actual")]/ancestor::tr/following-sibling::tr[1]//table',
    );
    const tabla = await tablaLocator.elementHandle();
    if (!tabla) throw new Error('No se encontró la tabla de Estado Actual');

    const filas = await tabla.$$('tr');
    const estado: Partial<EstadoAlumnoSIMAT> = {};

    for (const fila of filas) {
      const celdas = await fila.$$('td');
      for (let i = 0; i < celdas.length; i += 2) {
        // Primer td: label
        const labelDiv = await celdas[i].$('div.label');
        if (!labelDiv) continue;
        const label = (await labelDiv.innerText())
          .replace(':', '')
          .trim()
          .toUpperCase();

        // Segundo td: valor
        const valorTd = celdas[i + 1];
        if (!valorTd) continue;

        // Intenta encontrar el valor en <div align="left"> dentro del td
        let valor = '';
        const divValor = await valorTd.$('div[align="left"]');
        if (divValor) {
          valor = (await divValor.innerText()).trim();
        } else {
          // Si no hay div (solo ocurre en el campo de fecha, que es un input)
          const inputValor = await valorTd.$('input');
          if (inputValor) {
            valor = ((await inputValor.getAttribute('value')) || '').trim();
          }
        }

        // Mapeo directo de label a campo DTO
        switch (label) {
          case 'SECRETARÍA':
            estado.secretaria = valor;
            break;
          case 'JERARQUÍA':
            estado.jerarquia = valor;
            break;
          case 'AÑO DEL ESTADO':
            estado.anoEstado = valor;
            break;
          case 'ESTADO ACTUAL':
            estado.estadoActual = valor;
            break;
          case 'FECHA INICIAL DEL ESTADO':
            estado.fechaInicialEstado = valor;
            break;
          case 'NOMBRE INSTITUCIÓN':
            estado.institucion = valor;
            break;
          case 'NOMBRE SEDE':
            estado.sede = valor;
            break;
          case 'JORNADA':
            estado.jornada = valor;
            break;
          case 'METODOLOGÍA':
            estado.metodologia = valor;
            break;
          case 'GRADO':
            estado.grado = valor;
            break;
          case 'GRUPO':
            estado.grupo = valor;
            break;
          case 'CARACTER':
            estado.caracter = valor;
            break;
          case 'ESPECIALIDAD':
            estado.especialidad = valor;
            break;
          case 'MOTIVO':
            estado.motivo = valor;
            break;
          case 'RESIDENCIA ESCOLAR':
            estado.residenciaEscolar = valor;
            break;
        }
      }
    }

    // Devuelve todo siempre, aunque venga vacío
    return {
      secretaria: estado.secretaria ?? '',
      jerarquia: estado.jerarquia ?? '',
      anoEstado: estado.anoEstado ?? '',
      estadoActual: estado.estadoActual ?? '',
      fechaInicialEstado: estado.fechaInicialEstado ?? '',
      institucion: estado.institucion ?? '',
      sede: estado.sede ?? '',
      jornada: estado.jornada ?? '',
      metodologia: estado.metodologia ?? '',
      grado: estado.grado ?? '',
      grupo: estado.grupo ?? '',
      caracter: estado.caracter ?? '',
      especialidad: estado.especialidad ?? '',
      motivo: estado.motivo ?? '',
      residenciaEscolar: estado.residenciaEscolar ?? '',
    };
  }

  async extraerFichaYEstadoAlumno(params: {
    simatuser: string;
    simatpass: string;
    documento: string;
  }): Promise<{
    ficha: FichaAlumno;
    estado: EstadoAlumnoSIMAT;
  }> {
    let page: Page | undefined;
    try {
      if (!this.context) {
        this.browser = await chromium.launch({ headless: true });
        this.context = await this.browser.newContext();
      }
      page = await this.context.newPage();

      // === LOGIN Y FICHA ===
      await page.goto('https://www.sistemamatriculas.gov.co/simat/app', {
        timeout: 8000,
      });
      await page.fill('input[name="$TextField"]', params.simatuser);
      await page.fill('input[name="$TextField$0"]', params.simatpass);
      await page.keyboard.press('Enter');

      // Espera a que el menú esté presente
      await page.waitForSelector('#menu\\$MenuDropDown\\$3', { timeout: 7000 });
      await page.hover('#menu\\$MenuDropDown\\$3');
      await page.waitForTimeout(1000); // Aumenta el tiempo de espera para animación/despliegue

      // Haz clic en el menú "Estudiantes" para desplegar el submenú
      await page.click('#menu\\$MenuDropDown\\$3');
      await page.waitForTimeout(1000);

      // Ahora espera a que "Consulta de Alumnos" sea visible
      await page.waitForSelector('text=Consulta de Alumnos', {
        state: 'visible',
        timeout: 7000,
      });
      await page.click('text=Consulta de Alumnos');

      // Continúa con el resto del flujo
      await page.waitForTimeout(1200);
      await page.fill('input[name="doc"]', params.documento);
      await page.click('input[name="Buscar"]');
      await page.waitForTimeout(1800);
      await page.click('.detalleColumnValue a');
      await page.waitForSelector('input[name="codigoUnico"]');

      // --- EXTRACCIÓN DE CAMPOS FICHA ---
      const ficha: FichaAlumno = {
        codigoUnico: await this.getValue(page, 'input[name="codigoUnico"]'),
        fechaEstado: await this.getValue(
          page,
          'input[name="fechaInicioField"]',
        ),
        estadoAlumno: await this.getValue(page, 'input[name="$TextField"]'),
        paisOrigen: await this.getSelectText(page, 'select[name="paisOrigen"]'),
        tipoID: await this.getSelectText(page, 'select[name="menuTipoId"]'),
        numero: await this.getValue(page, 'input[name="doc"]'),
        deptExpedicion: await this.getSelectText(
          page,
          'select[name="menuDeptExpedicion"]',
        ),
        munExpedicion: await this.getSelectText(
          page,
          'select[name="menuMunExpedicion"]',
        ),
        genero: await this.getSelectText(page, 'select[name="menuGeneroComp"]'),
        fechaNacimiento: await this.getValue(page, 'input[name="fechaNmto"]'),
        deptNacimiento: await this.getSelectText(
          page,
          'select[name="menuDeptNacimiento"]',
        ),
        munNacimiento: await this.getSelectText(
          page,
          'select[name="menuMunNacimiento"]',
        ),
        primerApellido: await this.getValue(page, 'input[name="apellido1txt"]'),
        segundoApellido: await this.getValue(page, 'input[name="apellido2"]'),
        primerNombre: await this.getValue(page, 'input[name="nombre1txt"]'),
        segundoNombre: await this.getValue(page, 'input[name="nombre2"]'),
        direccionResidencia: await this.getValue(
          page,
          'input[name="direccionResidenciaComp"]',
        ),
        barrioResidencia: await this.getValue(
          page,
          'input[name="barrioResidencia"]',
        ),
        deptResidencia: await this.getSelectText(
          page,
          'select[name="menuDeptResidenciaComp"]',
        ),
        munResidencia: await this.getSelectText(
          page,
          'select[name="menuMunResidenciaComp"]',
        ),
        zona: await this.getSelectText(page, 'select[name="zonaComp"]'),
        telefono: await this.getValue(page, 'input[name="dirtelefonoComp"]'),
        email: await this.getValue(page, 'input[name="email"]'),
        caracter: await this.getSelectText(page, 'select[name="caracter"]'),
        especialidad: await this.getSelectText(
          page,
          'select[name="especialidad"]',
        ),
        matriculaContratada: await this.getValue(
          page,
          'input[name="$Checkbox$0"]',
        ),
        contrato: await this.getSelectText(page, 'select[name="conv"]'),
        estrategias: await page.$$eval('table .estrategiaColumnValue', (els) =>
          Array.from(els)
            .map((el) => (el as HTMLElement).innerText?.trim())
            .filter(Boolean),
        ),
        fechasInicio: await page.$$eval(
          'table .fechaInicioColumnValue',
          (els) =>
            Array.from(els)
              .map((el) => (el as HTMLElement).innerText?.trim())
              .filter(Boolean),
        ),
        fechasFin: await page.$$eval('table .fechaFinColumnValue', (els) =>
          Array.from(els)
            .map((el) => (el as HTMLElement).innerText?.trim())
            .filter(Boolean),
        ),
        epsAfiliado: await this.getSelectText(
          page,
          'select[name="menuEpsComp"]',
        ),
        ipsAsignada: await this.getValue(page, 'input[name="ips"]'),
        rh: await this.getSelectText(page, 'select[name="$ComboConstante"]'),
        arsAfiliado: await this.getSelectText(
          page,
          'select[name="menuArsComp"]',
        ),
        victimaConflicto: await this.getSelectText(
          page,
          'select[name="poblaVictimaConflicVur"]',
        ),
        sisbenIV: await this.getSelectText(page, 'select[name="menuSisbeniv"]'),
        sisbenIVCat: await this.getSelectText(
          page,
          'select[name="menuSisbenivCat"]',
        ),
        carnetSisben: await this.getValue(page, 'input[name="carnetSisben"]'),
        estrato: await this.getSelectText(
          page,
          'select[name="menuEstratoComp"]',
        ),
        fuenteRecursos: await this.getSelectText(
          page,
          'select[name="menuFuenteRecursosComp"]',
        ),
        madreCabeza: await this.getValue(page, 'input[name="$Checkbox$2"]'),
        beneficiarioHijoMadreCabeza: await this.getValue(
          page,
          'input[name="$Checkbox$3"]',
        ),
        beneficiarioVeterano: await this.getValue(
          page,
          'input[name="$Checkbox$4"]',
        ),
        beneficiarioHeroe: await this.getValue(
          page,
          'input[name="$Checkbox$5"]',
        ),
        resguardo: await this.getSelectText(
          page,
          'select[name="menuResguardoComp"]',
        ),
        etnia: await this.getSelectText(page, 'select[name="menuEtniaComp"]'),
        discapacidad: await page.$$eval('table .categoriaColumnValue', (els) =>
          Array.from(els)
            .map((el) => (el as HTMLElement).innerText?.trim())
            .filter(Boolean),
        ),
        discapacidadSeleccionada: await page.$$eval(
          'table .subcategoriaColumnValue select option[selected]',
          (els) =>
            Array.from(els)
              .map((el) => (el as HTMLElement).innerText?.trim())
              .filter(Boolean),
        ),
        capacidades: await page.$$eval(
          'select[name="capacidades"] option[selected]',
          (els) =>
            Array.from(els)
              .map((el) => (el as HTMLElement).innerText?.trim())
              .filter(Boolean),
        ),
        trastornoAprendizaje: await this.getSelectText(
          page,
          'select[name="menuTrastorno"]',
        ),
        apoyoAcademico: await this.getSelectText(
          page,
          'select[name="menuApoyoAcademicoEspecialComp"]',
        ),
        srpa: await this.getSelectText(page, 'select[name="menuSrpaComp"]'),
        familiares: [],
      };

      // Familiares (igual que antes)
      const parentescosValidos = [
        'MADRE',
        'PADRE',
        'HERMANO',
        'HERMANA',
        'ABUELO',
        'ABUELA',
        'TIO',
        'TIA',
        'PRIMO',
        'PRIMA',
        'ACUDIENTE',
        'OTRO',
      ];
      const familiaresTodos = await page.$$eval(
        'table tr.even, table tr.odd',
        (trs, parentescosValidos) =>
          trs
            .map((tr) => {
              const tds = Array.from(tr.querySelectorAll('td'));
              return {
                familiar: tds[0]?.innerText?.trim() || '',
                parentesco: tds[1]?.innerText?.trim().toUpperCase() || '',
                acudiente: tds[2]?.innerText?.trim() || '',
                tipoDocumento: tds[3]?.innerText?.trim() || '',
                documento: tds[4]?.innerText?.trim() || '',
                telefono: tds[5]?.innerText?.trim() || '',
                correo: tds[6]?.innerText?.trim() || '',
              };
            })
            .filter(
              (f) =>
                f.familiar &&
                parentescosValidos.includes(f.parentesco) &&
                !f.familiar.endsWith(':') &&
                !f.familiar.endsWith('*') &&
                f.familiar.length > 3,
            ),
        parentescosValidos,
      );
      let principales = familiaresTodos.filter((f) => f.acudiente === 'S');
      if (principales.length < 3) {
        const resto = familiaresTodos.filter(
          (f) =>
            !principales.some((p) => p.familiar === f.familiar) &&
            ['MADRE', 'PADRE'].includes(f.parentesco.toUpperCase()),
        );
        principales = principales.concat(resto).slice(0, 3);
      } else {
        principales = principales.slice(0, 3);
      }
      if (principales.length < 3) {
        const extra = familiaresTodos.filter(
          (f) => !principales.some((p) => p.familiar === f.familiar),
        );
        principales = principales.concat(extra).slice(0, 3);
      }
      ficha.familiares = principales;

      // ============ CAMBIO DE PESTAÑA PARA ESTADO/NOVEDAD ============
      await page.click('#menu\\$MenuDropDown\\$6');
      await page.waitForTimeout(400);
      await page.click('text=Novedades');
      await page.waitForTimeout(600);
      await page.fill('input[name="doc"]', params.documento);
      await page.click('input[name="Buscar"]');
      await page.waitForTimeout(1200);
      await page.click('img[alt="Ver Novedades"]');
      await page.waitForSelector('table', { timeout: 3000 });

      // --------- EXTRACCIÓN NUEVA DE ESTADO ACTUAL ----------
      const estado = await this.extraerEstadoActualPorDiv(page);

      this.logger.log(
        '=== ESTADO FINAL === ' + JSON.stringify(estado, null, 2),
      );
      await page.close();
      return { ficha, estado };
    } catch (err) {
      if (page) await page.close();
      this.logger.error('ERROR en extraerFichaYEstadoAlumno', err);
      throw err;
    }
  }
}
