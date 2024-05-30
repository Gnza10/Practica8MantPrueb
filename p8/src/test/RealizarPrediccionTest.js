import { browser } from 'k6/experimental/browser';
import { check } from 'k6';


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
        await page.goto('http://localhost:4200/paciente/1');
        
        const imageButton = page.locator('button[name="view"]');
        await Promise.all([page.waitForNavigation(), imageButton.click()]);

        const predictButton = page.locator('button[name="predict"]');
        predictButton.click();
        
        page.waitForSelector('span[name="predict"]');
        
        const predText = page.locator('div[class="center-content result ng-star-inserted"]').textContent();

        check(predText, {
          'Prediction is correct': text => text.includes('Not cancer (label 0)'),
        });

    } finally {
      page.close();
    }
}