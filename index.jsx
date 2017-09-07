var React = require('react');
var routie = require('./lib/routie');
var Page = require('./components/page.jsx');
var Panel = require('./components/panel.jsx');
var render = require('./components/render.jsx');

routie('', home);
routie('/', home);

function home(){
    render(<Page icon="fa-home" title="Hello World"><Panel title="Foo"><h1>Hello World</h1></Panel></Page>, '#/');
}

// do this after all the routes have been set
routie.reload();
