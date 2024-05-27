import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations', // para realizar iteraciones sin indicar el tiempo
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ["rate==1.0"]
  }
}

export default async function () {
  const page = browser.newPage();
  try {
    await page.goto('http://localhost:4200/');

    const nombre = page.locator('input[name="nombre"]');
    const DNI = page.locator('input[name="DNI"]');
    nombre.type('Manolo')
    DNI.type('333333C')
    const loginButton = page.locator('button[name="login"]')

    await Promise.all([page.waitForNavigation(), loginButton.click()]);
    check(page, {
      'header': p => p.locator('h2').textContent() == 'Listado de pacientes',
    });
    sleep(5);
  } finally {
    page.close();
  }
}