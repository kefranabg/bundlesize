const Build = require('github-build')
const prettycli = require('prettycli')
const { repo, sha } = require('ci-env')
const token = require('./token')
const debug = require('./debug')

const exit = () => process.exit(1)
let pass = () => {} // noop
let fail = exit
let error = exit

const label = 'bundlesize'
const description = 'Checking output size...'
const meta = { repo, sha, token, label, description }

const build = new Build(meta)

debug('token exists', !!token)
debug('repo', repo)
debug('sha', sha)

if (token) {
  const handleError = err => {
    const message = `Could not add github status.
        ${err.status}: ${err.error.message}`

    prettycli.error(message, { silent: true, label: 'ERROR' })
  }

  build.start().catch(handleError)
  pass = (message, url) => build.pass(message, url).catch(handleError)
  // fail = (message, url) => build.fail(message, url).catch(handleError)
  // error = (message, url) => build.error(message, url).catch(handleError)
  fail = (message, url) =>
    build
      .fail(message, url)
      .catch(handleError)
      .then(exit)
  error = (message, url) =>
    build
      .error(message, url)
      .catch(handleError)
      .then(exit)
}

module.exports = { pass, fail, error }
