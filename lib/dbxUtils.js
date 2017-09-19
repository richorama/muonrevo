var Dropbox = require('dropbox');
var dbx = new Dropbox({ clientId: "ra1zvn70dm90i04" });
var storage = require('./storage');
var initialised = false;


module.exports.getDbx = () => {
    // already initialised, so return client
    if (initialised) return dbx;

    // not initialised, but we've got a stored token
    var accessToken = storage.get("accessToken");
    if (accessToken){
        dbx.setAccessToken(accessToken)
        initialised = true;
        return dbx;    
    } 
    
    // no token, let's redirect and get one
    redirectToDbxLogin();
}

module.exports.handleError = (err) => {
    // has the token expired? If so, redirect back to dropbox to get a new one
    console.log("ERROR");
    console.log(err);
}

function redirectToDbxLogin(){
    var returnUrl = window.location.href.split('#')[0]    
    window.location.href = dbx.getAuthenticationUrl(returnUrl);
}