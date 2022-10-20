import PupUtils from "./pupUtils.js";

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

    // Try to insert user if requested
    try {
        await PupUtils.waitAndType(
            page,
            userCheckSelector,
            user,
            "User check"
        );
        await page.keyboard.press("Enter");
    } catch (e) {
        console.log("User check skipped");
    }

    // Insert password
    await PupUtils.waitForFocusAndType(
        page,
        passwordSelector,
        password,
        "Password"
    );
    await page.keyboard.press("Enter");

    // Wait login to complete
    await page.waitForNavigation({ waitUnitl: 'networkidle2' });
}

async function publishTweet(page, content, imagesPaths = []) {
    const tweetInputSelector = "div[class='public-DraftStyleDefault-block public-DraftStyleDefault-ltr']";
    const uploadMediaSelector = "path[d='M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z']";
    const submitTweetSelector = "div[class='css-901oao r-1awozwy r-6koalj r-18u37iz r-16y2uox r-37j5jr r-a023e6 r-b88u0q r-1777fci r-rjixqe r-bcqeeo r-q4m81j r-qvutc0']";

    // Go to make tweet page
    await page.goto("https://twitter.com/compose/tweet");

    // Upload image if the imagesPaths param is not empty
    if (imagesPaths.length !== 0) {
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            PupUtils.waitForFocusAndClick(page, uploadMediaSelector, "Upload Image", true)
        ]);
        await fileChooser.accept(imagesPaths);
    }

    // Types tweet content
    await PupUtils.waitForFocusAndType(
        page,
        tweetInputSelector,
        content,
        "Tweet"
    );

    await PupUtils.waitForFocusAndClick(page, submitTweetSelector, "Submit Tweet");
};

export default { login, publishTweet };
