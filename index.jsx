var React = require('react');
var routie = require('./lib/routie');
var Page = require('./components/page.jsx');
var Panel = require('./components/panel.jsx');
var render = require('./components/render.jsx');
var storage = require('./lib/storage');
var dbxUtil = require('./lib/dbxUtils');

routie('', home);
routie('/', home);

function home(){
    render.loading();

    var dbx = dbxUtil.getDbx();
    dbx.filesListFolder({path:''}).then(files => {
        console.log(files);
        render(<Page icon="fa-home" title="Hello World"><Panel title="Foo"><h1>Hello World</h1></Panel></Page>, '#/');
    }).catch(dbxUtil.handleError);
}

routie('access_token=*', (query)=>{
    var token = query.split('&')[0];
    storage.put('accessToken', token);
    routie('/')
    
/*
cursor
entries
has_more
*/

    
});

// do this after all the routes have been set
routie.reload();
