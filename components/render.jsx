var React = require('react');
var ReactDom = require('react-dom');
var Menu = require('./menu.jsx');
var Loading = require('./loading.jsx');
var Search = require('./search.jsx');

var contentElement = document.getElementById('content');
var menuElement = document.getElementById('menu');
var notificationElement = document.getElementById('notification-content');
var statusElement = document.getElementById('status-content');

module.exports = function(jsx){
    ReactDom.render(jsx, contentElement);
}

module.exports.loading = function(){
    ReactDom.render(<Loading/>, contentElement);
}

module.exports.notification = function(jsx){
    ReactDom.render(jsx, notificationElement);
}

module.exports.status = function(jsx){
    ReactDom.render(jsx, statusElement);
}

var searchCallback;
module.exports.onSearch = function(cb){
    searchCallback = cb;
}

