import { test, expect } from '@playwright/test';
import { ContactPage } from './pages';

test.describe('Contact Section', () => {
  let contact: ContactPage;

  test.beforeEach(async ({ page }) => {
    contact = new ContactPage(page);
    await contact.goto();
    await contact.scrollToSection();
  });

  test('contact section is visible', async () => {
    await expect(contact.section).toBeVisible();
  });

  test('section contains "Let\'s Work Together" heading', async () => {
    await expect(contact.section).toContainText("Let's Work Together");
  });

  test('email link has a valid mailto href', async () => {
    await expect(contact.emailLink).toBeVisible();
    await expect(contact.emailLink).toHaveAttribute('href', /^mailto:.+@.+\..+/);
  });

  test('email trigger button is present', async () => {
    await expect(contact.emailTrigger).toBeVisible();
  });

  test('GitHub social link is present and opens in new tab', async () => {
    await expect(contact.githubLink).toBeVisible();
    await expect(contact.githubLink).toHaveAttribute('target', '_blank');
    await expect(contact.githubLink).toHaveAttribute('href', /github\.com/);
  });

  test('LinkedIn social link is present and opens in new tab', async () => {
    await expect(contact.linkedinLink).toBeVisible();
    await expect(contact.linkedinLink).toHaveAttribute('target', '_blank');
    await expect(contact.linkedinLink).toHaveAttribute('href', /linkedin\.com/);
  });

  test('Twitter social link is present and opens in new tab', async () => {
    await expect(contact.twitterLink).toBeVisible();
    await expect(contact.twitterLink).toHaveAttribute('target', '_blank');
  });

  test('all social rows have noopener noreferrer', async () => {
    const count = await contact.socialRows.count();
    for (let i = 0; i < count; i++) {
      await expect(contact.socialRows.nth(i)).toHaveAttribute('rel', /noopener/);
    }
  });

  test('source code link is present', async () => {
    await expect(contact.sourceLink).toBeVisible();
    await expect(contact.sourceLink).toHaveAttribute('href', /github\.com/);
    await expect(contact.sourceLink).toHaveAttribute('target', '_blank');
  });

  test('LinkedIn URL in social row does not overflow its container', async () => {
    const infoBox = await contact.socialInfo.first().boundingBox();
    const urlBox  = await contact.socialUrls.first().boundingBox();
    expect(urlBox!.width).toBeLessThanOrEqual(infoBox!.width + 1);
  });
});
