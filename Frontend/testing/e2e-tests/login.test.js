
import { before, after, describe, it } from "node:test";
import puppeteer from "puppeteer";
import assert from "node:assert";

let browser, page;

// https://pptr.dev/guides/page-interactions
describe("End to end login", () => { 
        before(async () => {
            console.log("launching browser...");
            browser = await puppeteer.launch({
                headless: false,
                slowMo: 48
            });
            page = await browser.newPage();
        })

        after(async () => {
            console.log("closing browser...");
            await browser.close();
        });
        
        it("Should show an error when login is incorrect credentials", async () => {
            const testUsername = "wrongUser";
            const testPassword = "bob123";

            console.log("Navigate to loginPage...");
            await page.goto(`http://localhost:3030/login`);

            await page.waitForSelector('input[name="username"]');
            
            await page.type('input[name="username"]', testUsername); 
            await page.type('input[name="password"]', testPassword);
            await page.click('button[type="submit"]');

            await page.waitForSelector(".error-message");

            // $eval returns the results
            const errorMessage = await page.$$eval(".error-message", el => el.textContent.trim());
            assert.strictEqual(errorMessage, "invalid credentials");

            await page.screenshot({ path: "login_error_username.png" });
        });

        it("Should allow a user to log in with correct credentials", async () => {
            const testUsername = "bob";
            const testPassword = "bob123";

            console.log("Navigate to loginPage...");
            await page.goto(`http://localhost:3030/login`);

            await page.waitForSelector('input[name="username"]');
            
            await page.type('input[name="username"]', testUsername); 
            await page.type('input[name="password"]', testPassword);
            await page.click('button[type="submit"]');

            await page.waitForSelector("h1")

            const url = await page.url();
            assert.strictEqual(url, "http://localhost:3030/dashboard");

            await page.screenshot({ path: "login_test_screenshot.png"});
    });
});