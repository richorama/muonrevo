var React = require('react');
var ReactDom = require('react-dom');
var Menu = require('./menu.jsx');
var routie = require('../lib/routie');
var Loading = require('./loading.jsx');
var Search = require('./search.jsx');

var contentElement = document.getElementById('content');
var menuElement = document.getElementById('menu');
var notificationElement = document.getElementById('notification-content');
var statusElement = document.getElementById('status-content');

module.exports = function(jsx, menu, showSearch){
    ReactDom.render(jsx, contentElement);
    
    if(showSearch){
        return ReactDom.render(<span><Search onSearch={searchCallback} /><Menu menu={menu} /></span>, menuElement);    
    }
    ReactDom.render(<Menu menu={menu} />, menuElement);
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

