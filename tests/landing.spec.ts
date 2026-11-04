import { test, expect } from "@playwright/test";

test("all three languages translate the page and persist after reload", async ({
  page,
}) => {
  await page.goto("/?lang=uk");
  await expect(page.locator("html")).toHaveAttribute("lang", "uk");
  await expect(page.locator("h1")).toContainText("МІСТО");
  await page.getByRole("button", { name: "Русский", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.locator("h1")).toContainText("ГОРОД");
  await expect(page.locator("#collection-heading")).toContainText("ВЫБИРАЙ");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toContainText("YOUR");
  await expect(page.locator("#location-heading")).toContainText("IN KYIV.");
  expect(await page.locator("body").innerText()).not.toMatch(
    /[А-Яа-яІіЇїЄєҐґ]/,
  );
  for (const element of await page.locator("[aria-label]").all()) {
    const label = await element.getAttribute("aria-label");
    if (label === "Українська" || label === "Русский") continue;
    expect(label).not.toMatch(/[А-Яа-яІіЇїЄєҐґ]/);
  }
  await expect(page).toHaveTitle("City Brands — your city, your style");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("button", { name: "English", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("all supplied videos load, play and close with restored focus", async ({
  page,
}) => {
  await page.goto("/?lang=en");
  for (let index = 0; index < 4; index++) {
    const opener = page.locator(".story-card").nth(index);
    await opener.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const video = dialog.locator("video");
    await expect
      .poll(() =>
        video.evaluate((element) => (element as HTMLVideoElement).readyState),
      )
      .toBeGreaterThanOrEqual(2);
    await expect
      .poll(() =>
        video.evaluate((element) => (element as HTMLVideoElement).currentTime),
      )
      .toBeGreaterThan(0);
    expect(
      await video.evaluate((element) => (element as HTMLVideoElement).error),
    ).toBeNull();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
    await expect(page.locator("body")).not.toHaveClass(/dialog-open/);
  }
});

test("video navigation, pause and sound controls work", async ({ page }) => {
  await page.goto("/?lang=en");
  await page
    .getByRole("button", { name: "Watch the City Brands video", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Next video", exact: true }).click();
  await expect(dialog.locator("h2")).toHaveText(
    "The little things that make a look",
  );
  await dialog
    .getByRole("button", { name: "Previous video", exact: true })
    .click();
  await expect(dialog.locator("h2")).toHaveText("Meet City Brands");
  await dialog.getByRole("button", { name: "Mute", exact: true }).click();
  await expect(dialog.locator("video")).toHaveJSProperty("muted", true);
  await dialog
    .getByRole("button", { name: "Pause video", exact: true })
    .click();
  await expect(dialog.locator("video")).toHaveJSProperty("paused", true);
  await dialog
    .getByRole("button", { name: "Close video", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
});

test("Telegram and directions use real destinations, and address can be copied", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?lang=en");
  const telegramLinks = page.locator('a[href*="t.me"]');
  expect(await telegramLinks.count()).toBeGreaterThan(3);
  for (const link of await telegramLinks.all())
    await expect(link).toHaveAttribute("href", "https://t.me/city_brands1");
  const directions = page.getByRole("link", {
    name: "Get directions",
    exact: true,
  });
  const href = await directions.getAttribute("href");
  const destination = new URL(href!).searchParams.get("destination");
  expect(destination).toBe("проспект Петра Григоренка, 32Д, Київ, 02140");
  await page.getByRole("button", { name: "Copy address", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Address copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    destination,
  );
});

test("mobile navigation works and closes after choosing a section", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=en");
  const menu = page.getByRole("button", { name: "Open menu", exact: true });
  await expect(page.getByRole("navigation")).not.toBeVisible();
  await menu.click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Find us", exact: true })
    .click();
  await expect(page).toHaveURL(/#location$/);
  await expect(page.getByRole("navigation")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open menu", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("layouts fit phone, tablet and desktop in every language without broken images", async ({
  page,
}) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ["uk", "ru", "en"]) {
      await page.goto(`/?lang=${lang}`);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(
        overflow,
        `${width}px / ${lang} horizontal overflow`,
      ).toBeLessThanOrEqual(1);
      const headingFits = await page.locator('.hero').evaluate(hero => {
        const boundary = hero.getBoundingClientRect();
        return [...hero.querySelectorAll('.hero-line')].every(line => {
          const range = document.createRange();
          range.selectNodeContents(line);
          const text = range.getBoundingClientRect();
          return text.right <= boundary.right - 12 && text.left >= boundary.left;
        });
      });
      expect(headingFits, `${width}px / ${lang} heading must not be cropped`).toBe(true);
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(
              (element) => (element as HTMLImageElement).naturalWidth,
            ),
          )
          .toBeGreaterThan(0);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('category filters open the matching video and FAQ expands', async ({ page }) => {
  await page.goto('/?lang=en');
  const filters = page.getByRole('group', { name: 'The collection', exact: true });
  await filters.getByRole('button', { name: 'Footwear', exact: true }).click();
  await expect(page.locator('.category-card')).toHaveCount(1);
  await expect(page.locator('.category-title')).toHaveText('Footwear');
  await page.locator('.category-card').click();
  await expect(page.getByRole('dialog').locator('h2')).toHaveText('Step into your own style');
  await page.keyboard.press('Escape');
  await filters.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.category-card')).toHaveCount(3);
  const hours = page.locator('details').filter({ has: page.locator('summary', { hasText: 'What are your opening hours?' }) });
  await hours.locator('summary').click();
  await expect(hours).toHaveAttribute('open', '');
  await expect(hours.locator('p')).toBeVisible();
});

test("reduced motion leaves the content visible and stops the background video", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?lang=en");
  await expect(page.locator(".hero-video")).toHaveJSProperty("paused", true);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator(".about-copy")).toHaveCSS("opacity", "1");
  await expect(page.locator(".marquee-track")).toHaveCSS(
    "animation-name",
    "none",
  );
});
