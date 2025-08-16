// src/infrastructure/services/simat-login.service.ts

import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { error } from 'console';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuthService.name);
  private browser: Browser | undefined;
  private context: BrowserContext | undefined;

  async onModuleInit() {
    // Modo headless (invisible), navegador abierto 1 sola vez
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
    });
    try {
      const page = await this.context.newPage();
      // Solo entra a la página principal, no importa si no loguea nada
      await page.goto('https://www.sistemamatriculas.gov.co/simat/app', {
        waitUntil: 'domcontentloaded',
        timeout: 5000,
      });
      await page.close();
    } catch {
      console.log(error);
    }
  }

  async onModuleDestroy() {
    if (this.browser) await this.browser.close();
  }

  async validateCredentials(loginDto: {
    simatuser: string;
    simatpass: string;
  }): Promise<{ success: boolean; message: string }> {
    let page: Page | undefined;
    try {
      const { simatuser, simatpass } = loginDto;
      if (!this.context)
        throw new Error('El contexto de navegador no está inicializado');
      page = await this.context.newPage();

      // Minimiza huellas de automatización (opcional, por si acaso)
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
      });

      // 1. Cargar página, timeout mínimo
      await page.goto('https://www.sistemamatriculas.gov.co/simat/app', {
        waitUntil: 'domcontentloaded',
        timeout: 3000,
      });

      // 2. Encuentra el iframe/formulario lo más rápido posible
      const iframes = page.frames();
      let formFrame = page.mainFrame();
      for (const frame of iframes) {
        const input = await frame.$('input[name="$TextField"]');
        if (input) {
          formFrame = frame;
          break;
        }
      }

      // 3. Espera los campos sólo 800ms
      await formFrame.waitForSelector('input[name="$TextField"]', {
        state: 'visible',
        timeout: 800,
      });
      await formFrame.waitForSelector('input[name="$TextField$0"]', {
        state: 'visible',
        timeout: 800,
      });

      // 4. Llena campos SIN DELAY (inmediato)
      await formFrame.fill('input[name="$TextField"]', simatuser);
      await formFrame.fill('input[name="$TextField$0"]', simatpass);

      // 5. Click inmediato en login
      const submitButton = await formFrame.$(
        'input[type="submit"], button[type="submit"], button:has-text("Iniciar Sesión")',
      );
      if (submitButton) {
        await submitButton.click();
      } else {
        await page.keyboard.press('Enter');
      }

      // 6. Espera mínima a la navegación (1.2 segundos)
      await page.waitForNavigation({ timeout: 1200 }).catch(() => {
        this.logger.warn('No se detectó navegación');
      });

      // 7. Verifica login con timeout bajísimo (500ms)
      const isLoggedIn = await page.isVisible('#menu\\$MenuDropDown\\$3', {
        timeout: 500,
      });

      await page.close();

      if (isLoggedIn) {
        this.logger.log('Login exitoso');
        return { success: true, message: 'Inicio de sesión exitoso' };
      } else {
        this.logger.warn('Login fallido');
        return {
          success: false,
          message: 'Credenciales inválidas o la página cambió',
        };
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error(`Error en el login: ${errorMsg}`);
      if (page)
        await page.screenshot({
          path: 'screenshot-error.png',
          fullPage: true,
        });
      if (page) await page.close();
      return {
        success: false,
        message: `Ocurrió un error durante el login: ${errorMsg}`,
      };
    }
  }
}
