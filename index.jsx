var React = require('react');
var routie = require('./lib/routie');
var Page = require('./components/page.jsx');
var Panel = require('./components/panel.jsx');
var render = require('./components/render.jsx');
var storage = require('./lib/storage');
var dbxUtil = require('./lib/dbxUtils');
var FolderPage = require('./components/folder-page.jsx')

routie('', home);
routie('/', home);

function home(){
    render.loading();

    var dbx = dbxUtil.getDbx();
    dbx.filesListFolder({path:''}).then(data => {
        console.log(data);
        render(<FolderPage files={data.entries} /> , '#/');
    }).catch(dbxUtil.handleError);
}

routie('access_token=*', (query)=>{
    var token = query.split('&')[0];
    storage.put('accessToken', token);
    routie('/')
});

// do this after all the routes have been set
routie.reload();
