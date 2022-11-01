import PupUtils from "./pupUtils.js";

async function login(page, user, password) {
    // Selectors
    const userSelector = "input[autocomplete='username']";
    const passwordSelector = "input[autocomplete='current-password']";
    const submitSelector = "button[type='submit']";

    // Insert user
    await PupUtils.waitForFocusAndType(
        page,
        userSelector,
        user,
        "User"
    );
    // Insert password
    await PupUtils.waitForFocusAndType(
        page,
        passwordSelector,
        password,
        "Password"
    );
    // Submit to login
    await PupUtils.waitForFocusAndClick(
        page,
        submitSelector,
        "Submit"
    );
}

async function publishPost(page, content, imagesPaths = [], debugMode = false) {
    const createPostSelector = "button[class='artdeco-button artdeco-button--muted artdeco-button--4 artdeco-button--tertiary ember-view share-box-feed-entry__trigger']";
    const textFieldSelector = "div[aria-label='Editor de texto para criação de conteúdo']";
    const publishButtonSelector = "button[class='share-actions__primary-action artdeco-button artdeco-button--2 artdeco-button--primary ember-view']";
    const uploadImageSelector = "path[d='M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm1 13a1 1 0 01-.29.71L16 14l-2 2-6-6-4 4V7a1 1 0 011-1h14a1 1 0 011 1zm-2-7a2 2 0 11-2-2 2 2 0 012 2z']";
    const confirmUploadSelector = "button[class='ml2 artdeco-button artdeco-button--2 artdeco-button--primary ember-view']";

    await PupUtils.waitForFocusAndClick(
        page,
        createPostSelector,
        "Create post"
    );

    // Upload image if the imagesPaths paramter is not empty
    if (imagesPaths.length !== 0) {
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            PupUtils.waitForFocusAndClick(
                page,
                uploadImageSelector,
                "Upload Image",
                true
            )
        ]);
        await fileChooser.accept(imagesPaths);

        await PupUtils.waitForFocusAndClick(
            page,
            confirmUploadSelector
        );
    }

    await PupUtils.waitAndType(
        page,
        textFieldSelector,
        content,
        "Post Content"
    );

    if (!debugMode) {
        await PupUtils.waitForFocusAndClick(
            page,
            publishButtonSelector,
            "Submit Post"
        );
    }

    await page.waitForNetworkIdle();
}

export default { login, publishPost };
