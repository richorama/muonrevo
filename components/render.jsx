var React = require('react');
var ReactDom = require('react-dom');
var Menu = require('./menu.jsx');
var routie = require('../lib/routie');
var Loading = require('./loading.jsx');

var contentElement = document.getElementById('content');
var menuElement = document.getElementById('menu');

module.exports = function(jsx, path){

    ReactDom.render(jsx, contentElement);
    var menu = getMenu();
    menu.forEach(x => {
        x.active = (x.path === path);
    });

    ReactDom.render(<Menu menu={menu} />, menuElement);
}

module.exports.loading = function(){
    ReactDom.render(<Loading/>, contentElement);
}


function getMenu(){
    return [
        {
            name:"Home",
            path:"#/",
            icon:"fa-home"
        },
        {
            name:"Settings",
            path:"#/settings",
            icon:"fa-cogs"
        }
    ];
}
