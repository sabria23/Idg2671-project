
import { before, after, describe, it } from "node:test";
import puppeteer from "puppeteer";
import assert from "node:assert";
import path from "path";
import fs from "fs";

let browser, page;

const screenshotF = path.resolve("screenshots");
fs.mkdirSync(screenshotF, { recursive: true});


// https://pptr.dev/guides/page-interactions
describe("End to end login", () => { 
  
        before(async () => {
            console.log("launching browser...");
            browser = await puppeteer.launch({
                headless: false,
                defaultViewport: false,
                slowMo: 48
            });
            page = await browser.newPage();
        });

        after(async () => {
            console.log("closing browser...");
            await browser.close();
        });

        it("Register then go to login to login again", async () => {
          await page.goto(`http://localhost:3030/register`);
          const testUsername = "aliakseix";
          const testEmail = "aliakseix@gmail.com"
          const testPassword = "aliakseix123";
          const testConfirmPassword = "aliakseix123";

          
          await page.waitForSelector('input[name="username"]');
            
            await page.type('input[name="username"]', testUsername); 
            await page.type('input[name="email"]', testEmail);
            await page.type('input[name="password"]', testPassword);
            await page.type('input[name="confirmPassword"]', testConfirmPassword);
            await page.click('button[type="submit"]');

            await page.screenshot({ path: path.resolve(screenshotF, "signUp_username.png") });
        });
        
        
        it("Should show an error when login is incorrect credentials", async () => {
            const testUsername = "wrongUser";
            const testPassword = "aliakseix123";

            console.log("Navigate to loginPage...");
            await page.goto(`http://localhost:3030/login`);

            await page.waitForSelector('input[name="username"]');
            
            await page.type('input[name="username"]', testUsername); 
            await page.type('input[name="password"]', testPassword);
            await page.click('button[type="submit"]');

            await page.waitForSelector(".error-message");

            // $eval returns the results
            const errorMessage = await page.$eval(".error-message", el => el.textContent.trim());
            assert.strictEqual(errorMessage, "invalid credentials");

            await page.screenshot({ path: path.resolve(screenshotF, "login_error_username.png") });
        });

        it("Should allow login with correct credentials", async () => {
            const testUsername = "aliakseix";
            const testPassword = "aliakseix123";

            await page.goto(`http://localhost:3030/login`);

            await page.waitForSelector('input[name="username"]');
            
            await page.type('input[name="username"]', testUsername); 
            await page.type('input[name="password"]', testPassword);
            await page.click('button[type="submit"]');

            await page.screenshot({ path: path.resolve(screenshotF, "login_correct_screenshot.png") });

            await page.waitForSelector("h1")

            const url = await page.url();
            assert.strictEqual(url, "http://localhost:3030/dashboard");

           
    });
    it("Should navigate to create new study page when clicking create your first project button", async () =>{

      await page.waitForSelector("h1");

      await page.waitForSelector('[data-testid="create-first-project-button"]');

      await page.click('[data-testid="create-first-project-button"]');
    
      await page.screenshot({ path: path.resolve(screenshotF, "create_first_project.png") });
    });
});