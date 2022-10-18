import Puppeteer from "puppeteer";
import PupUtils from "./pupUtils.js";
import credentials from "./credentials.json" assert {type: "json"};
import postInfo from "./postInfo.json" assert {type: "json"};

async function main() {
    const { browser, page } = await startBrowser();
    await page.goto("https://twitter.com/i/flow/login");

    login(page, credentials.twitter.email, credentials.twitter.user, credentials.twitter.password);

    publishTweet(page, postInfo.content, postInfo.images);
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


async function login(page, email, user, password) {
    const emailSelector = "input[autocomplete='username']";
    const userCheckSelector = "span[class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']";
    const passwordSelector = "input[autocomplete='current-password']"

    // Insert user
    await PupUtils.waitForFocusAndType(
        page,
        emailSelector,
        email,
        "E-mail"
    );
    await page.keyboard.press("Enter");

    try {
        await PupUtils.waitAndType(
            page,
            userCheckSelector,
            user,
            "User check"
        );
        await page.keyboard.press("Enter");

        // await page.waitForSelector(userCheckSelector);
        // await page.keyboard.type(user);
        // console.log("Twitter user check completed");
    } catch (e) {
        console.log("User check skipped");
    }

    await PupUtils.waitForFocusAndType(
        page,
        passwordSelector,
        password,
        "Password"
    );

    // await page.waitForSelector(passwordSelector);
    // await page.keyboard.type(password);
    // console.log("Twitter password typed");
    await page.keyboard.press("Enter");

    // Wait login to complete
    await page.waitForNavigation({ waitUnitl: 'networkidle2' });
}

// KINDA BROKEN
async function publishTweet(page, content, imagesPaths = []) {
    const tweetInputSelector = "div[class='public-DraftStyleDefault-block public-DraftStyleDefault-ltr']";
    const uploadMediaSelector = "path[d='M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z']";

    // Go to make tweet page
    await page.goto("https://twitter.com/compose/tweet");

    // Types tweet content
    await page.waitForSelector(tweetInputSelector);
    await page.keyboard.type(content);

    // Upload image if the imagesPaths param is not empty
    if (imagesPaths.length !== 0) {
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(uploadMediaSelector)
        ]);
        await fileChooser.accept(imagesPaths);
    }
};
