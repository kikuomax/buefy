/**
 * Tests "/documentation/start" page.
 *
 * @nolint
 * @oncall web_perf_infra
 */

const { baseAction, back, url, repeat } = require('./test-documentation-base')

// action where you suspect the memory leak might be happening
function action(page) {
    return baseAction(page, 'start')
}

module.exports = { action, back, url, repeat }
