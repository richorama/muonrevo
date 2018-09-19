var React = require('react');
var ReactDOM = require('react-dom');
var routie = require('./lib/routie');
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
var Notification = require('./components/notification.jsx');

var lastPath = "";
routie('', home);
routie('/', home);
routie('/path*', home);

var requestId = 0;
function getRequestId(){
    return ++requestId;
}

function hasRequestExpired(myRequestId){
    return (myRequestId !== requestId);
}

function setTitle(title){
    document.title = (title || "")
        .replace('/','')
        .replace(".md","");
}

var timeout;
function showNotification(icon, message){
    if (timeout) clearTimeout(timeout);
    var jsx = <Notification message={message} icon={icon} />
    render.notification(jsx);
    timeout = setTimeout(clearNotification, 5000);
}

function clearNotification(){
    timeout = null;
    render.notification(<span/>);
}

function handleError(){
    showNotification("close", "FAILED");
}

var hasBeenEdited = false;
function edited(){
    if (!hasBeenEdited){
        window.onbeforeunload = () => true;
        render.status(<Notification message="EDITED" icon="circle" />);
        document.getElementById("favicon").setAttribute('href', 'favicon-edit.png');
    }
    hasBeenEdited = true;
}

function saved(){
    hasBeenEdited = false;
    window.onbeforeunload = null;
    render.status(<span></span>);
    document.getElementById("favicon").setAttribute('href', 'favicon.png');
}

function home(path){
    saved();
    setTitle('MuonRevo');
    var myReqId = getRequestId();

    lastPath = path || "";
    render.loading();

    var selectedFile;
    var filesData;  
    var fileContent;
    var dbx = dbxUtil.getDbx();
    dbx.filesListFolder({path:path || ''}).then(data => {
        filesData = data;
        renderPage();
    }).catch(handleError);

    var loadFile = (meta) => {
        setTitle(meta.path_display);
        selectedFile = meta;
        dbx.filesCachedDownload({path:meta.path_lower, rev:meta.rev}).then(data => {
            readContent(data, content => {
                fileContent = content;    
                renderPage();
            });
        }).catch(handleError);
    };

    var deleteFolder = () => {
        render.loading();
        dbx.filesDelete({
            path:path
        }).then(() => {
            routie(`/path${getParent(path)}`);
        }).catch(handleError);

    };

    render.onSearch(term => {
        setTitle(`Seaching: ${term}`)
        render.loading();
        dbx.filesSearch({path:lastPath, query:term, mode:'filename_and_content' }).then(results => {
            //filesData.entries = results.matches.map(match => match.metadata);
            renderPage(results.matches.map(match => match.metadata), term);
        }).catch(handleError);
    });
  
    var renderPage = (search, term) => {
        if (hasRequestExpired(myReqId)) return;

        var files = filesData.entries;
        var menu;
        if (search) {
            files = search;
            menu = [
                {
                    name:"Clear Search",
                    onClick:() => renderPage(),
                    icon:"fa-times"
                }
            ];
        } else {
            menu = [
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
    
        }


        render(<FolderPage path={path} files={files} fileContent={fileContent} loadFile={loadFile} searchTerm={term} /> , menu, true);
    };
}

routie('/edit*', path => {
    saved();
    var myReqId = getRequestId();
    render.loading();
    var dbx = dbxUtil.getDbx();

    var mode = "edit";
    var revisions;
    var fileName;
    var pathDisplay;
    var save = () => {
        showNotification("save", "SAVING...");
        render.loading();
        dbx.filesUpload({
            path : pathDisplay,
            contents : fileContent,
            mode : {".tag" : "update", update : rev},
            autorename : true,
            mute : storage.get("mute") === "true"
        }).then(x => {
            showNotification("check", "SAVED");
            saved();
            routie('/')
        }).catch(() => {
            renderPage();
            handleError();
        });
    };

    var saveContinue = () => {
        showNotification("save", "SAVING...");
        dbx.filesUpload({
            path : pathDisplay,
            contents : fileContent,
            mode : {".tag" : "update", update : rev},
            autorename : true,
            mute : storage.get("mute") === "true"
        }).then(x => {
            rev = x.rev;
            showNotification("check", "SAVED");
            saved();
        }).catch(handleError);
    };

    saveCalled = function(){
        if (hasRequestExpired(myReqId)) return;
        saveContinue();
    }

    var fileContent;
    var updateContent = newContent => {
        fileContent = newContent;
        edited();
    }
    var revisionContent;
    var revisionRev;
    var rev;
    var loadContent = () => {
        dbx.filesDownload({path:path}).then(data => {
            readContent(data, content => {
                setTitle(data.path_display);
                fileContent = content;    
                fileName = data.name;
                rev = data.rev;
                pathDisplay = data.path_display;
                renderPage();
            });
        }).catch(handleError);
    };
    loadContent();

    var loadRevisions = () => {
        dbx.filesListRevisions({path:path}).then(revs => {
            revisions = revs.entries;
            renderPage();
        }).catch(handleError);
    }

    var handleRevisionClick = (file) => {
        dbx.filesDownload({path:file.path_lower, rev:file.rev}).then(data => {
            readContent(data, content => {
                revisionContent = content;
                revisionRev = data.rev;
                renderPage();
            });
        }).catch(() => {
            revisionContent = "ERROR: unable to load content";
            revisionRev = file.rev;
            renderPage();
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
        }).catch(handleError);
    };

    var renderPage = () => {
        if (hasRequestExpired(myReqId)) return;
        var menu = [
            {
                name:"Save & Close",
                onClick: save,
                icon:"fa-save"
            },
            {
                name:"Save",
                onClick: saveContinue,
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
            render(<EditPage fileContent={fileContent} fileName={fileName} onUpdate={newValue => updateContent(newValue.content)} /> , menu);
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
    setTitle('New Entry');
    saved();
    var myReqId = getRequestId();
    var dbx = dbxUtil.getDbx();
    var rev;

    var save = () => {
        showNotification("save", "SAVING...");
        render.loading();
        dbx.filesUpload({
            path : `${path || ""}/${state.title}.md`,
            contents : state.content,
            mode : rev ? {".tag" : "update", update : rev} :  {".tag" : "add"},
            autorename : true,
            mute : storage.get("mute") === "true"
        }).then(x => {
            saved();
            showNotification("check", "SAVED");
            routie(`/path${path}`);
        }).catch(() => {
            renderPage();
            handleError();
        });
    }

    var saveContinue = () => {
        showNotification("save", "SAVING...");
        dbx.filesUpload({
            path : `${path || ""}/${state.title}.md`,
            contents : state.content,
            mode : rev ? {".tag" : "update", update : rev} :  {".tag" : "add"},
            autorename : true,
            mute : storage.get("mute") === "true"
        }).then(x => {
            rev = x.rev;
            saved();
            showNotification("check", "SAVED");
        }).catch(handleError);
    }

    var state = {
        content : "Enter your notes here...",
        title : ""
    };
    var editMode = true;

    var renderPage = () => {
        if (hasRequestExpired(myReqId)) return;

        var menu = [
            {
                name:"Save & Close",
                onClick:save,
                icon:"fa-save"
            },
            {
                name:"Save",
                onClick:saveContinue,
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
            render(<NewPage onUpdate={newState => { state = newState; edited()} } fileContent={state.content} title={state.title} />, menu);
        } else {
            render(<PreviewPage fileContent={state.content} fileName={state.title} /> , menu);
        }
    }

    renderPage();
    
});

routie('/new-folder*', path => {
    setTitle('New Folder');
    saved();
    var dbx = dbxUtil.getDbx();
    var name = ""
    var createFolder = () => {
        render.loading();
        if (!name) return;
        dbx.filesCreateFolderV2({
            path:`${path}/${name}`
        }).then(() => {
            routie(`/path${path}/${name}`);
        }).catch(handleError);
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
    setTitle('Confirm Delete');
    saved();
    var dbx = dbxUtil.getDbx();

    var deleteFile = () => {
        showNotification("trash", "DELETING...");
        render.loading();
        dbx.filesDelete({
            path:path
        }).then(() => {
            showNotification("check", "DELETED");
            routie(`/path${getParent(path)}`);
        }).catch(handleError);
    };

    var menu = [
        {
            name:"Delete",
            onClick:deleteFile,
            icon:"fa-trash"
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
    setTitle('Settings');
    saved();
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
    saved();
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
    saved();
    ReactDOM.render(<UserPanel user={user} />, document.getElementById("user-content"));
});



// do this after all the routes have been set
routie.reload();


var saveCalled = null;

window.addEventListener("keydown", function (e) {
    if((e.ctrlKey || e.metaKey) && e.key === "s" ){
        e.preventDefault();
        if (saveCalled) saveCalled();
    }
});