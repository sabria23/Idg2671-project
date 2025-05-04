
// import { before, after, describe, it } from "node:test";
// import puppeteer from "puppeteer";
// import assert from "node:assert";

// let browser, page;

// // https://pptr.dev/guides/page-interactions
// describe("End to end dashboard", () => { 
//         before(async () => {
//             console.log("launching browser...");
//             browser = await puppeteer.launch({
//                 headless: false,
//                 slowMo: 48,
//             });
//             page = await browser.newPage();
//         })

      

//         after(async () => {
//             console.log("closing browser...");
//             await browser.close();
//         });
//         it("should log in first", async () => {
//             const testUsername = "bob";
//             const testPassword = "bob123";

//             console.log("Navigate to loginPage...");
//             await page.goto(`http://localhost:3030/login`);

//             await page.waitForSelector('input[name="username"]');
            
//             await page.type('input[name="username"]', testUsername); 
//             await page.type('input[name="password"]', testPassword);
//             await page.click('button[type="submit"]');


//             await page.waitForNavigation();
//             console.log("On dashboard page now");

//             await page.waitForSelector('.studyItem', { timeout: 500 });

//             await page.click('button[aria-label="More options"]');

//             await page.waitForSelector('.dropdownMenu', { visible: true });

//             await page.evaluate(() => {
//               const items = Array.from(document.querySelectorAll(".dropdownItem"));
//             })
            
//         })
//         it("delete a study item in dashboard", async () => {

//           console.log("Logging in first...");
//           await page.goto("http://localhost:3030/login");
//           await page.waitForSelector('input[name="username"]'); 
//           await page.click('data-testid="delete-button"]');
//           await page.click('data-testid="confirm-delete-button"]');
        
          


//           await page.screenshot({ path: "after_delete_screenshot.png"});
//     });
// });