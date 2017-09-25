var React = require('react');
var ReactDom = require('react-dom');
var Menu = require('./menu.jsx');
var routie = require('../lib/routie');
var Loading = require('./loading.jsx');

var contentElement = document.getElementById('content');
var menuElement = document.getElementById('menu');

module.exports = function(jsx, menu){
    ReactDom.render(jsx, contentElement);
    ReactDom.render(<Menu menu={menu} />, menuElement);
}

module.exports.loading = function(){
    ReactDom.render(<Loading/>, contentElement);
}

