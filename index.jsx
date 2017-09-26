var React = require('react');
var ReactDOM = require('react-dom');
var routie = require('./lib/routie');
var Page = require('./components/page.jsx');
var Panel = require('./components/panel.jsx');
var render = require('./components/render.jsx');
var storage = require('./lib/storage');
var dbxUtil = require('./lib/dbxUtils');
var FolderPage = require('./components/folder-page.jsx');
var EditPage = require('./components/edit-page.jsx');
var UserPanel = require('./components/user-panel.jsx');
var NewPage = require('./components/new-page.jsx');

routie('', home);
routie('/', home);
routie('/path*', home);

function home(path){
    render.loading();

    var filesData;  
    var fileContent;
    var dbx = dbxUtil.getDbx();
    dbx.filesListFolder({path:path || ''}).then(data => {
        filesData = data;
        renderPage();
    }).catch(dbxUtil.handleError);

    var loadFile = (meta) => {
        dbx.filesDownload({path:meta.path_lower}).then(data => {
            readContent(data, content => {
                fileContent = content;    
                renderPage();
            });
        }).catch(dbxUtil.handleError);
    };

    

    var renderPage = () => {

        var menu = [
            {
                name:"New Page",
                path:"#/new-page" + path,
                icon:"fa-file-text"
            },
            {
                name:"New Folder",
                path:"#/new-folder" + path,
                icon:"fa-folder-open"
            },
            {
                title:"Folders"
            }
        ];

        if (path){
            var pathParts = path.split('/');
            pathParts.pop();
            var parentPath = pathParts.join('/');
            menu.push({
                name: "Parent Folder",
                path:"#/path" + parentPath,
                icon:"fa-level-up"
            })
        }

        filesData.entries.filter(x => x[".tag"] === "folder").reverse().forEach(x => {
            menu.push({
                name:x.name,
                path:"#/path" + x.path_lower,
                icon:"fa-folder"
            });
        })

        render(<FolderPage files={filesData.entries} fileContent={fileContent} loadFile={loadFile} /> , menu);
    };
}

routie('/edit*', path => {
    render.loading();
    var dbx = dbxUtil.getDbx();

    var save = value => {
        dbx.filesUpload({
            path : path,
            contents : value,
            mode : {".tag" : "update", update : rev},
            autorename : true
        }).then(x => {
            routie('/')
        })
    };

    var fileContent;
    var rev;
    dbx.filesDownload({path:path}).then(data => {
        console.log(data);
        readContent(data, content => {
            fileContent = content;    
            rev = data.rev;
            renderPage();
        });
    }).catch(dbxUtil.handleError);

    var menu = [];

    var renderPage = () => {
        render(<EditPage fileContent={fileContent} onSave={save} /> , menu);
    };
});

routie('/new-page*', (path) => {
    var menu = [];
    render(<NewPage/>, menu);
});

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


dbxUtil.on("user", user => {
    console.log("callback", user)
    ReactDOM.render(<UserPanel user={user} />, document.getElementById("user-content"));
});

// do this after all the routes have been set
routie.reload();
