var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var If = require('./if-else.jsx');

var Files = React.createClass({
    render:function(){
        return <Panel title="Entries" noPadding={true}>
            <table className="table"><tbody>
            {this.props.files.filter(x => x[".tag"] === "file").map((file) => {
                var style = "";
                if (file === this.props.selectedFile){
                    style = "active"
                }

                return <tr key={file.id} className={style} ><td>
                    <a href="javascript:void(0);" onClick={this.props.onClick.bind(null, file)}>
                        <strong>{(file.name || "").replace('.md', '')}</strong>
                        <p className="text-muted">{file.client_modified}</p>
                    </a>
                </td></tr>
            })}
            </tbody></table>
        </Panel>

    }

});


var FilePreview = React.createClass({
    render:function(){
        return <Panel title={this.props.file.name}>
            <span>Content</span>
        </Panel>
    }

});


module.exports = React.createClass({
    getInitialState:function(){
        return {
            selectedFile : null
        }
    },

    onClick:function(newFile){
        this.setState({selectedFile : newFile});
    },

    render:function(){
        return <Page>
            <div className="row">
                <div className="col-md-3">
                    <Files 
                        files={this.props.files} 
                        onClick={this.onClick} 
                        selectedFile={this.state.selectedFile} />
                    
                </div>
                <div className="col-md-9">
                    <If test={this.state.selectedFile}>
                        <FilePreview file={this.state.selectedFile} />     
                    </If>
                </div>
            </div>
        </Page>
    }
});