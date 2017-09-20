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

    var filesData;  
    var fileContent;
    var dbx = dbxUtil.getDbx();
    dbx.filesListFolder({path:''}).then(data => {
        filesData = data;
        renderPage();
    }).catch(dbxUtil.handleError);

    var loadFile = (meta) => {
        console.log(meta);
        dbx.filesDownload({path:meta.path_lower}).then(data => {
            console.log(data)
            readContent(data, content => {
                fileContent = content;    
                renderPage();
            });
        }).catch(dbxUtil.handleError);
    };

    var renderPage = () => {
        render(<FolderPage files={filesData.entries} fileContent={fileContent} loadFile={loadFile} /> , '#/');
    };
}

routie('access_token=*', (query)=>{
    var token = query.split('&')[0];
    storage.put('accessToken', token);
    routie('/')
});

function readContent(file, cb){
    var reader = new FileReader();
    reader.onload = function() {
        cb(reader.result);
    }
    reader.readAsText(file.fileBlob);
}


// do this after all the routes have been set
routie.reload();
