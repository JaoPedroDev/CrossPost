async function waitForFocusAndType(page, selector, text, logName = "", visible = false) {
    await page.waitForSelector(selector, { visible: visible });
    await page.click(selector);
    await page.keyboard.type(text);
    if (logName) {
        console.log(`Typed on ${logName} field`);
    }
}

async function waitAndType(page, selector, text, logName = "", visible = false) {
    await page.waitForSelector(selector, { visible: visible });
    await page.keyboard.type(text);
    if (logName) {
        console.log(`Typed on ${logName} field`);
    }
}

async function waitForFocusAndClick(page, selector, logName = "", visible = false) {
    await page.waitForSelector(selector, { visible: visible });
    await page.click(selector);
    if (logName) {
        console.log(`Clicked on ${logName} element`);
    }
}

export default { waitForFocusAndType, waitAndType, waitForFocusAndClick };
