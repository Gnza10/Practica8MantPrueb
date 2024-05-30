import { browser } from 'k6/experimental/browser';
import { check,sleep } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
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
        await page.goto('http://localhost:4200/paciente/56');

        const viewButton = page.locator('button[name="view"]');
        await Promise.all([page.waitForNavigation(), viewButton.click()]);

        const addButton = page.locator('button[name="add"]');
        await Promise.all([page.waitForNavigation(), addButton.click()]);

        page.locator('textarea').type('Contenido del informe');

        const saveButton = page.locator('button[name="save"]');
        await Promise.all([page.waitForNavigation(), saveButton.click()]);
        
        const infoValueSpan = page.locator('span[name="content"]');
        check(infoValueSpan, {
            'infoValue': i => i.textContent() == 'Contenido del informe',
          });


    } finally {
        page.close();
    }
}