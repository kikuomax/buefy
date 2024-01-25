/**
 * Base scenario for pages under /documentation.
 *
 * @nolint
 * @oncall web_perf_infra
 */

function url() {
    return 'http://localhost:8080/documentation'
}

// action where you suspect the memory leak might be happening
async function baseAction(page, subpage, selector) {
    const targetHref = `/documentation/${subpage}`
    await page.waitForSelector('.sidebar-menu a', {
        visible: true
    })
    const links = await page.$$(`.sidebar-menu a[href="${targetHref}"]`)
    console.log('links', links.length)
    for (const link of links) {
        link.evaluate((h) => {
            h.click()
        })

        await page.waitForSelector(selector, {
            visible: true
        })
    }
}

// how to go back to the state before actionw
async function back(page) {
    const home = await page.$('a[href="/documentation"]')
    home.evaluate((h) => {
        h.click()
    })
    // makes sure that the documentation component is rendered
    await page.waitForSelector('article.content', {
        visible: true
    })
}

module.exports = { baseAction, back, url, repeat: () => 3 }
