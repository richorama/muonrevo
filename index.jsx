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
var PreviewPage = require('./components/preview-page.jsx');
var ConfirmDeletePage = require('./components/confirm-delete-page.jsx');


routie('', home);
routie('/', home);
routie('/path*', home);

function home(path){
    render.loading();

    var selectedFile;
    var filesData;  
    var fileContent;
    var dbx = dbxUtil.getDbx();
    dbx.filesListFolder({path:path || ''}).then(data => {
        filesData = data;
        renderPage();
    }).catch(dbxUtil.handleError);

    var loadFile = (meta) => {
        selectedFile = meta;
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
                name:"New Entry",
                path:"#/new-page" + path || "",
                icon:"fa-file-text"
            },
            {
                name:"New Folder",
                path:"#/new-folder" + path || "",
                icon:"fa-folder-open"
            }
        ];

        if (selectedFile){
            menu.push({
                title:"ENTRY"
            });
                        
            menu.push({
                name: "Edit",
                path:"#/edit" + selectedFile.path_lower,
                icon:"fa-pencil-square-o"
            });
        }

        if (path || filesData.entries.filter(x => x[".tag"] === "folder").length){
            menu.push({
                title:"FOLDERS"
            });
        }

        if (path){
            
            menu.push({
                name: "Parent Folder",
                path:"#/path" + getParent(path),
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

        render(<FolderPage path={path} files={filesData.entries} fileContent={fileContent} loadFile={loadFile} /> , menu);
    };
}

routie('/edit*', path => {
    render.loading();
    var dbx = dbxUtil.getDbx();

    var editMode = true;
    var fileName;
    var save = () => {
        dbx.filesUpload({
            path : path,
            contents : fileContent,
            mode : {".tag" : "update", update : rev},
            autorename : true
        }).then(x => {
            routie('/')
        })
    };

    var fileContent;
    var rev;
    dbx.filesDownload({path:path}).then(data => {
        readContent(data, content => {
            fileContent = content;    
            fileName = data.name;
            rev = data.rev;
            renderPage();
        });
    }).catch(dbxUtil.handleError);

    var renderPage = () => {

        var menu = [
            {
                name:"Save",
                onClick: save,
                icon:"fa-save"
            },
            {
                name:"Cancel",
                path:`#/path${getParent(path)}`,
                icon:"fa-times"
            },
            {
                title:"VIEW"
            },
            {
                name: "Edit",
                onClick:_=> {
                    editMode = true;
                    renderPage();
                },
                icon:"fa-edit",
                active : editMode 
            },
            {
                name: "Preview",
                onClick:_=> {
                    editMode = false;
                    renderPage();
                },
                icon:"fa-eye",
                active : !editMode
            },
            {
                title:"DANGER"
            },
            {
                name:"Delete",
                path: `#/delete${path}`,
                icon:"fa-trash"
            }
        ];

        if (editMode){
            render(<EditPage fileContent={fileContent} fileName={fileName} onUpdate={newValue => fileContent = newValue.content} /> , menu);
        } else {
            render(<PreviewPage fileContent={fileContent} fileName={fileName} /> , menu);
        }
        
    };
});

routie('/new-page*', (path) => {
    var dbx = dbxUtil.getDbx();

    var save = () => {
        dbx.filesUpload({
            path : `${path || ""}/${state.title}.md`,
            contents : state.content,
            mode : {".tag" : "add"},
            autorename : true
        }).then(x => {
            routie(`/path${path}`);
        })
    }
    var state = {
        content : "",
        title : ""
    };
    var editMode = true;

    var renderPage = () => {

        var menu = [
            {
                name:"Save",
                onClick:save,
                icon:"fa-save"
            },
            {
                name:"Cancel",
                path: `#/path${path}`,
                icon:"fa-times"
            },
            {
                title:"VIEW"
            },
            {
                name: "Edit",
                onClick:_=> {
                    editMode = true;
                    renderPage();
                },
                icon:"fa-edit",
                active : editMode 
            },
            {
                name: "Preview",
                onClick:_=> {
                    editMode = false;
                    renderPage();
                },
                icon:"fa-eye",
                active : !editMode
            }
        ];

        
        if (editMode){
            render(<NewPage onUpdate={newState => state = newState} fileContent={state.content} title={state.title} />, menu);
        } else {
            render(<PreviewPage fileContent={state.content} fileName={state.title} /> , menu);
        }
    }

    renderPage();
    
});


routie('/delete*', path => {
    var dbx = dbxUtil.getDbx();

    var deleteFile = () => {
        render.loading();
        dbx.filesDelete({path:path}).then(() => {
            routie(`/path${getParent(path)}`);
        })
    };

    var menu = [
        {
            name:"Delete",
            onClick:deleteFile,
            icon:"fa-save"
        },
        {
            name:"Cancel",
            path: `#/edit${path}`,
            icon:"fa-times"
        }
    ];

    render(<ConfirmDeletePage path={path} />, menu)

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

function getParent(path){
    var pathParts = path.split('/');
    pathParts.pop();
    return pathParts.join('/');
}

dbxUtil.on("user", user => {
    console.log("callback", user)
    ReactDOM.render(<UserPanel user={user} />, document.getElementById("user-content"));
});

// do this after all the routes have been set
routie.reload();
