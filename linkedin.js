async function login(page, user, password) {
    // Insert user
    await page.click("#username");
    await page.keyboard.type(user);
    console.log("username typed");

    // Insert password
    await page.click("#password");
    await page.keyboard.type(password);
    console.log("password typed");

    // Submit to login
    await page.click("button[type='submit']");
    console.log("submit pressed");
}

async function publishPost(page, content, imagesPaths = [], videosPaths = []) {
    if (imagesPaths.length !== 0 && videosPaths.length !== 0) {
        console.error("Only one type of media permited!");
        return;
    }

    // Selectors
    const createPostSelector = "button[class='artdeco-button artdeco-button--muted artdeco-button--4 artdeco-button--tertiary ember-view share-box-feed-entry__trigger']";
    const publishButtonSelector = "button[class='share-actions__primary-action artdeco-button artdeco-button--2 artdeco-button--primary ember-view']";
    const uploadImageSelector = "path[d='M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm1 13a1 1 0 01-.29.71L16 14l-2 2-6-6-4 4V7a1 1 0 011-1h14a1 1 0 011 1zm-2-7a2 2 0 11-2-2 2 2 0 012 2z']";
    const uploadVideoSelector = "path[d='M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm-9 12V8l6 4z']";
    const confirmUploadSelector = "button[class='ml2 artdeco-button artdeco-button--2 artdeco-button--primary ember-view']";

    // Waits for the Create Post field to exist then click it
    await page.waitForSelector(createPostSelector);
    await page.click(createPostSelector);
    console.log("create post clicked");

    // Necessary for post pop-up be interactable
    await page.waitForSelector(uploadVideoSelector, { visible: true });

    // Upload image if the imagesPaths param is not empty
    if (imagesPaths.length !== 0) {
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(uploadImageSelector),
        ]);
        await fileChooser.accept(imagesPaths);

        // Waits for confirm upload button to appear
        await page.waitForSelector(confirmUploadSelector, { visible: true });
        await page.click(confirmUploadSelector);
    }

    // Upload video if the videosPaths is not empty
    if (videosPaths.length !== 0) {
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(uploadVideoSelector),
        ]);
        await fileChooser.accept(videosPaths);

        // Waits for confirm upload button to appear
        await page.waitForSelector(confirmUploadSelector, { visible: true });
        await page.click(confirmUploadSelector);
    }

    await page.keyboard.type(content);

    // Waits for Publish Button to be clickable then click it
    // await page.waitForSelector(publishButtonSelector);
    // await page.click(publishButtonSelector);
}

export default { login, publishPost };
