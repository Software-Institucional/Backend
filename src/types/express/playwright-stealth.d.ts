// playwright-stealth.d.ts
declare module 'playwright-stealth' {
  // Puedes mejorar los tipos si lo deseas, pero esto elimina el error
  export function addStealth<T>(context: T): Promise<T>;
}
