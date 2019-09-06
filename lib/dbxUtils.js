var dropboxOptions = {
  clientId: 'ra1zvn70dm90i04'
}

const Dropbox = require('dropbox').Dropbox

const dbx = new Dropbox(dropboxOptions)
const storage = require('./storage')
let initialised = false
const routie = require('./routie')
const cacheMachine = require('./cacheMachine')

var events = {}

module.exports.on = (name, cb) => {
  if (!events[name]) events[name] = []
  events[name].push(cb)
}

module.exports.getDbx = suppressRedirect => {
  // already initialised, so return client
  if (initialised) return dbx

  // not initialised, but we've got a stored token
  var accessToken = storage.get('accessToken')
  if (accessToken) {
    dbx.setAccessToken(accessToken)
    initialised = true

    dbx.usersGetCurrentAccount().then(user => {
      // fire event to any listeners
      //(events['user'] || []).forEach(x => x(user))
    })

    cacheMachine.addCachingMethods(dbx)

    return dbx
  }

  // no token, let's redirect and get one
  redirectToDbxLogin()
}

module.exports.getLoginUrl = () => {
  var returnUrl = window.location.href.split('#')[0]
  return dbx.getAuthenticationUrl(returnUrl)
}

module.exports.handleError = err => {
  // has the token expired? If so, redirect back to dropbox to get a new one
  console.log('ERROR')
  console.log(err)
}

function redirectToDbxLogin() {
  routie('/login')
}
