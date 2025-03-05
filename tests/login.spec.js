import { test, expect } from '@playwright/test';

import { getCode2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';

test('Não deve logar quando o código de autenticação é inválido', async ({ page }) => {
  const loginPage = new LoginPage(page)

  const user = {
    cpf: '00000014141',
    password: '147258'
  }

  await loginPage.accessPage()
  await loginPage.fillCPFAndClick(user.cpf)
  await loginPage.fillPasswordAndClick(user.password)
  await loginPage.infoCode2FA('123456')

  await expect(page.locator('span'))
    .toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  const user = {
    cpf: '00000014141',
    password: '147258'
  }

  await loginPage.accessPage()
  await loginPage.fillCPFAndClick(user.cpf)
  await loginPage.fillPasswordAndClick(user.password)

  // temporário
  await page.waitForTimeout(3000)
  const code = await getCode2FA()

  await loginPage.infoCode2FA(code)

  // temporário
  await page.waitForTimeout(2000)

  expect(await dashPage.getBalance()).toHaveText('R$ 5.000,00')

  await page.waitForTimeout(3000)
});
