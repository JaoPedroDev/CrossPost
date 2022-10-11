import Puppeteer from "puppeteer";
import Linkedin from "./linkedin.js";
import credentials from "./credentials.json" assert {type: "json"};
import postInfo from "./postInfo.json" assert {type: "json"};

async function main() {
    const { browser, page } = await startBrowser();
    await page.goto("https://www.linkedin.com/login");

    await Linkedin.login(page, credentials.user, credentials.password);

    await Linkedin.publishPost(page, postInfo.content, postInfo.images, postInfo.videos);
}

async function startBrowser() {
    const browser = await Puppeteer.launch(
        {
            headless: false
            // slowMo: 10
        }
    );
    const page = await browser.newPage();
    await page.setViewport({ width: 672, height: 720 });

    // Intercept image and font request and abort then
    // doing so, they are not loaded
    await page.setRequestInterception(true);
    page.on("request", (req) => {
        if (req.resourceType() === "image" || req.resourceType() === "font") {
            req.abort();
        }
        else {
            req.continue()
        }
    });

    return { browser, page };
}

main();
