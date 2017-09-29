var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var If = require('./if-else.jsx');
var marked = require('marked');
var Loading = require('./loading.jsx');

var Files = React.createClass({
    render:function(){
        return <Panel title="Entries" noPadding={true}>
            <div style={{overflow:"auto", height:"80vh"}}>
            <table className="table"><tbody>
            {this.props.files.filter(x => x[".tag"] === "file").reverse().map(file => {
                var style = "";
                if (file === this.props.selectedFile){
                    style = "active"
                }

                return <tr key={file.id} className={style} ><td>
                    <a href="javascript:void(0);" onClick={this.props.onClick.bind(null, file)}>
                        <strong>{toDisplayName(file.name)}</strong>
                        <p className="text-muted">{file.client_modified}</p>
                    </a>
                </td></tr>
            })}
            </tbody></table></div>
        </Panel>

    }

});


var FilePreview = React.createClass({
    createMarkup : function() { 
        return {__html: marked(this.props.fileContent || "")}; 
    },
    render:function(){
        return <Panel title={toDisplayName(this.props.file.name)}>
            <div style={{overflow:"auto", height:"80vh"}}>
                <If test={this.props.loading}>
                    <Loading/>
                    <div dangerouslySetInnerHTML={this.createMarkup()}></div>
                </If>
            </div>
        </Panel>
    }

});


module.exports = React.createClass({
    getInitialState:function(){
        return {
            selectedFile : null
        }
    },

    componentWillReceiveProps:function(newProps){
        var newState = {
            fileContent : newProps.fileContent,
            loading : false
        };
        
        this.setState(newState);
    },

    loadFile:function(){
        this.props.loadFile(this.state.selectedFile);
    },

    onClick:function(newFile){
        this.setState({selectedFile : newFile, fileContent : null, loading:true}, this.loadFile);
    },

    render:function(){
        return <Page path={this.props.path}>
            <div className="row">
                <div className="col-md-3">
                    <Files 
                        files={this.props.files} 
                        onClick={this.onClick} 
                        selectedFile={this.state.selectedFile} />
                    
                </div>
                <div className="col-md-9">
                    <If test={this.state.selectedFile}>
                        <FilePreview file={this.state.selectedFile}  loading={this.state.loading} fileContent={this.state.fileContent} />     
                    </If>
                </div>
            </div>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}