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
var NewFolderPage = require('./components/new-folder-page.jsx');
var Settings = require('./components/settings-page.jsx');
var ConfirmRefirectPage = require('./components/confirm-redirect-page.jsx');
var HistoryPage = require('./components/history-page.jsx');
var lastPath = "";
routie('', home);
routie('/', home);
routie('/path*', home);


function home(path){
    lastPath = path || "";
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
        dbx.filesCachedDownload({path:meta.path_lower, rev:meta.rev}).then(data => {
            readContent(data, content => {
                fileContent = content;    
                renderPage();
            });
        }).catch(dbxUtil.handleError);
    };

    var deleteFolder = () => {
        render.loading();
        dbx.filesDelete({
            path:path
        }).then(() => {
            routie(`/path${getParent(path)}`);
        });

    };

    render.onSearch(term => {
        dbx.filesSearch({path:lastPath, query:term, mode:'filename_and_content' }).then(results => {
            console.log(results);
            filesData.entries = results.matches.map(match => match.metadata);
            renderPage();
        });
    });
  
    var renderPage = () => {

        var menu = [
            {
                name:"New Entry",
                path:"#/new-page" + (path || ""),
                icon:"fa-file-text"
            },
            {
                name:"New Folder",
                path:"#/new-folder" + (path || ""),
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

        if (filesData.entries.length === 0){
            menu.push({
                title:"DANGER"
            });
            menu.push({
                name:"Delete Folder",
                onClick: deleteFolder,
                icon:"fa-trash"
            });
        }


        filesData.entries.filter(x => x[".tag"] === "folder").reverse().forEach(x => {
            menu.push({
                name:x.name,
                path:"#/path" + x.path_lower,
                icon:"fa-folder"
            });
        })

        render(<FolderPage path={path} files={filesData.entries} fileContent={fileContent} loadFile={loadFile} /> , menu, true);
    };
}

routie('/edit*', path => {
    render.loading();
    var dbx = dbxUtil.getDbx();

    var mode = "edit";
    var revisions;
    var fileName;
    var save = () => {
        render.loading();
        dbx.filesUpload({
            path : path,
            contents : fileContent,
            mode : {".tag" : "update", update : rev},
            autorename : true,
            mute : storage.get("mute") === "true"
        }).then(x => {
            routie('/')
        })
    };

    var fileContent;
    var revisionContent;
    var revisionRev;
    var rev;
    var loadContent = () => {
        dbx.filesDownload({path:path}).then(data => {
            readContent(data, content => {
                fileContent = content;    
                fileName = data.name;
                rev = data.rev;
                renderPage();
            });
        }).catch(dbxUtil.handleError);
    };
    loadContent();

    var loadRevisions = () => {
        dbx.filesListRevisions({path:path}).then(revs => {
            revisions = revs.entries;
            renderPage();
        });
    }

    var handleRevisionClick = (file) => {
        dbx.filesDownload({path:file.path_lower}).then(data => {
            readContent(data, content => {
                revisionContent = content;
                revisionRev = data.rev;
                renderPage();
            });
        });
        
    }

    var handleRestore = () => {
        render.loading();
        dbx.filesRestore({
            path:path, 
            rev:revisionRev
        }).then(() => {
            mode = "edit";
            revisionContent = null;
            revisionRev = null;
            loadContent();
        });
    };

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
                    mode = "edit";
                    renderPage();
                },
                icon:"fa-edit",
                active : mode=="edit" 
            },
            {
                name: "Preview",
                onClick:_=> {
                    mode = "preview"
                    renderPage();
                },
                icon:"fa-eye",
                active : mode=="preview"
            },
            {
                name: "Revisions",
                onClick:_=> {
                    mode = "history"
                    render.loading();
                    revisionContent = null;
                    loadRevisions();
                },
                icon:"fa-history",
                active : mode == "history"
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

        if (mode == "history" && revisionRev){
            menu.push({
                name:"Restore Revision",
                onClick: handleRestore,
                icon:"fa-undo"
            });
        }

        if (mode == "edit"){
            render(<EditPage fileContent={fileContent} fileName={fileName} onUpdate={newValue => fileContent = newValue.content} /> , menu);
        } 
        if (mode == "preview"){
            render(<PreviewPage fileContent={fileContent} fileName={fileName} /> , menu);
        }
        if (mode == "history"){
            render(<HistoryPage revisions={revisions} loadFile={handleRevisionClick}  fileContent={revisionContent} /> , menu);
        }
        
    };
});

routie('/new-page*', (path) => {
    var dbx = dbxUtil.getDbx();

    var save = () => {
        render.loading();
        dbx.filesUpload({
            path : `${path || ""}/${state.title}.md`,
            contents : state.content,
            mode : {".tag" : "add"},
            autorename : true,
            mute : storage.get("mute") === "true"
        }).then(x => {
            routie(`/path${path}`);
        })
    }
    var state = {
        content : "Enter your notes here...",
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
                path: `#/path${path || ""}`,
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

routie('/new-folder*', path => {
    var dbx = dbxUtil.getDbx();
    var name = ""
    var createFolder = () => {
        render.loading();
        if (!name) return;
        dbx.filesCreateFolderV2({
            path:`${path}/${name}`
        }).then(() => {
            routie(`/path${path}/${name}`);
        });
    };
    var handleUpdate = newValue => {
        name = newValue.title;
    };

    var menu = [
        {
            name:"Create",
            onClick:createFolder,
            icon:"fa-save"
        },
        {
            name:"Cancel",
            path: `#/path${path || ""}`,
            icon:"fa-times"
        }
    ];

    render(<NewFolderPage path={path} onUpdate={handleUpdate} />, menu);
});

routie('/delete*', path => {
    var dbx = dbxUtil.getDbx();

    var deleteFile = () => {
        render.loading();
        dbx.filesDelete({
            path:path
        }).then(() => {
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
            path: `#/edit${path || ""}`,
            icon:"fa-times"
        }
    ];

    render(<ConfirmDeletePage path={path} />, menu)

});

routie('/settings', () => {
    var dbx = dbxUtil.getDbx();
    var save = () => {
        if(state.theme){
            storage.put("editor-theme", state.theme)
        }
        if(state.notificationValue){
            storage.put("mute", state.notificationValue == 'Hide notifications');
        }
        routie('/');
    }
    var state = {};
    var menu = [
        {
            name:"Save",
            onClick:save,
            icon:"fa-save"
        },
        {
            name:"Cancel",
            path: `#/`,
            icon:"fa-times"
        }
    ];

    var handleUpdate = newState => {
        state = newState;
    }

    render(<Settings onUpdate={handleUpdate} />, menu)
});

routie('/login', ()=>{
    var url = dbxUtil.getLoginUrl();
    render(<ConfirmRefirectPage url={url} />, []);
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
    ReactDOM.render(<UserPanel user={user} />, document.getElementById("user-content"));
});



// do this after all the routes have been set
routie.reload();
