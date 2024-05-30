import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';


export const options = {
  scenarios: {
    ui: {
      executor: "shared-iterations",
      options: {
        browser: {
          type: "chromium",
        }
      }
    }
  },
  thresholds: {
    checks: ["rate==1.0"]
  }
}

export default async function () {
    const page = browser.newPage();

    try {
        await page.goto('http://localhost:4200');

        const nombreM = page.locator('input[name="nombre"]');
        nombreM.type('Greinheir');
        const dniM = page.locator('input[name="DNI"]');
        dniM.type('12345678A');
        const loginButton = page.locator('button[name="login"]');

        await Promise.all([page.waitForNavigation(), loginButton.click()]);
       
        const addButton = page.locator('button[name="add"]');

        await Promise.all([page.waitForNavigation(), addButton.click()]);

        const nombreP = page.locator('input[name="nombre"]');
        nombreP.type('Ibai');
        const dniP = page.locator('input[name="dni"]');
        dniP.type('87654321B');
        const edadP = page.locator('input[name="edad"]');
        edadP.type('29');
        const citaP = page.locator('input[name="cita"]');
        citaP.type('Hoy');

        const createButton = page.locator('button[type="submit"]');
        await Promise.all([page.waitForNavigation(), createButton.click()]);
       
        sleep(5);

        let tamano = page.$$("table tbody tr").length;

        check(page, {
          'header': p => p.locator('h2').textContent() == 'Listado de pacientes',
            'nombre created': p => p.$$("table tbody tr")[tamano-1].$('td[name="nombre"]').textContent().includes("Ibai") ,
            'dni created': p => p.$$("table tbody tr")[tamano-1].$('td[name="dni"]').textContent().includes("87654321B"),
          });

          sleep(5);

    } finally {
        page.close();
    }
}  