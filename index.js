import puppeteer from "puppeteer";
import fs from "fs";
import linkedin from "./linkedin.js";
import twitter from "./twitter.js";
import getCredentials from "./getCredentials.js";
import postInfo from "./postInfo.json" assert {type: "json"};

const DEBUGMODE = true; // Disable click on publish buttons
const CREDENTIALS_PATH = "./credentials.json";

async function main() {
    let credentials;

    // Create credentials.json if doesn't exist
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.log("Credentials not stored locally, creating...");

        const linkedinUser = await getCredentials.askForUser("Linkedin");
        const linkedinPassword = await getCredentials.askForPassword("Linkedin");

        const twitterUser = await getCredentials.askForUser("Twitter");
        const twitterPassword = await getCredentials.askForPassword("Twitter");

        const credentialsObj = {
            linkedin: {
                user: linkedinUser,
                password: linkedinPassword
            },
            twitter: {
                user: twitterUser,
                password: twitterPassword
            }
        }

        stringifyAndWrite(CREDENTIALS_PATH, credentialsObj);
    }

    // Read credentials.json
    credentials = readAndParse(CREDENTIALS_PATH);

    const { browser, page } = await startBrowser();

    // Linkedin
    console.log("LinkedIn:");
    await page.goto("https://www.linkedin.com/");
    await page.waitForNetworkIdle();
    // Check if already logged in plataform
    if (page.url() !== "https://www.linkedin.com/feed/") {
        console.log("Not logged yet, logging in...");
        await linkedin.login(page, credentials.linkedin.user, credentials.linkedin.password);
    } else {
        console.log("Already logged, skipping...");
    }
    await linkedin.publishPost(page, postInfo.content, postInfo.images, DEBUGMODE);

    // Twitter
    console.log("Twitter:");
    await page.goto("https://twitter.com/i/flow/login");
    // Check if already logged in plataform
    await page.waitForNetworkIdle();
    if (page.url() !== "https://twitter.com/home") {
        console.log("Not logged yet, loggin in...");
        await twitter.login(page, credentials.twitter.user, credentials.twitter.password);
    } else {
        console.log("Already logged, skipping...");
    }
    await twitter.publishTweet(page, postInfo.content, postInfo.images, DEBUGMODE);

    browser.close();
}

async function startBrowser() {
    const browser = await puppeteer.launch(
        {
            headless: false,
            userDataDir: "./user_data"
            // slowMo: 5
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

function readAndParse(filepath) {
    try {
        let jsonString = fs.readFileSync(filepath, "utf-8");
        let jsonParse = JSON.parse(jsonString);
        return jsonParse;
    } catch (err) {
        console.log(err);
    }
}

function stringifyAndWrite(filepath, obj) {
    try {
        fs.writeFileSync(filepath, JSON.stringify(obj, null, 2));
    } catch (err) {
        console.log(err);
    }
}

main();