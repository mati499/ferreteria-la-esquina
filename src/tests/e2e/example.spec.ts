import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Ferretería La Esquina/)
  await expect(page.getByRole('heading', { name: /Ferretería La Esquina/ })).toBeVisible()
})

test('can navigate to catalog', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Catálogo' }).click()
  await expect(page).toHaveURL('/catalogo')
})
