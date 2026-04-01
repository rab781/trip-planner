import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Go to login
        await page.goto("http://localhost:8000/login")
        await page.fill('input[name="email"]', 'budi@example.com')
        await page.fill('input[name="password"]', 'password')

        # Look for the button by role
        await page.get_by_role("button", name="Masuk").click()
        await page.wait_for_url("**/dashboard")

        # Go to itinerary 1
        await page.goto("http://localhost:8000/itineraries/1")

        try:
            # Wait for DraggableList or ItineraryCard to render
            await page.wait_for_selector('div[role="button"][aria-label*="Seret"]', state='attached', timeout=15000)

            # Press Tab to focus the drag handle (we might need to tab multiple times, or just focus it directly)
            handle = page.locator('div[role="button"][aria-label*="Seret"]').first
            await handle.focus()

            await page.screenshot(path="/home/jules/verification/drag_handle_focus.png", full_page=True)
            print("Screenshot saved to /home/jules/verification/drag_handle_focus.png")
        except Exception as e:
            await page.screenshot(path="/home/jules/verification/error_itinerary.png", full_page=True)
            print(f"Error, saved screenshot: {e}")

        await browser.close()

asyncio.run(main())
