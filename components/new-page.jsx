var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var If = require('./if-else.jsx');
var marked = require('marked');
var Monaco = require('react-monaco-editor').default;

module.exports = React.createClass({

    getInitialState:function(){
        return {
            fileContent : this.props.fileContent
        }
    },

    handleChange : function(value){
        this.setState({fileContent : value})
    },

    handleTitleChange:function(){
        console.log(arguments);
    },

    handleSaveClick : function(){
        this.props.onSave(this.state.fileContent);
    },

    handleCancel : function(){
        window.history.back();
    },

    render:function(){
        
        return <Page>
            <Panel title="Add a new entry">
                <div>

                    <div>
                        <input style={{marginBottom:"10px"}} className="form-control input-lg" type="text" placeholder="Enter a title..." value={this.state.title} onChange={this.handleTitleChange} />
                    </div>

                    <Monaco
                        height="500"
                        value={this.state.fileContent || ""}
                        theme="vs-dark"
                        language="markdown"
                        options={{selectOnLineNumbers: true, lineNumbers:false, renderLineHighlight : "none", fontSize:18}}
                        onChange={this.handleChange} />
                </div>
                <div>
                    <a href="javascript:void(0);" className="btn btn-primary" onClick={this.handleSaveClick} >Save</a> <a href="javascript:void(0);" className="btn btn-default" onClick={this.handleCancel} >Cancel</a>
                </div>
            </Panel>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}