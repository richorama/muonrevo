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

    handleChange : function(){

    },

    render:function(){
        
        return <Page>
            <Panel title="Edit">
                <div>
                    <Monaco
                        height="500"
                        value={this.state.fileContent || ""}
                        theme="vs-dark"
                        language="markdown"
                        options={{selectOnLineNumbers: true, lineNumbers:false, renderLineHighlight : "none", fontSize:18}}
                        onChange={this.handleChange} />
                </div>
                <div>
                    <a href="javascript:void(0);" className="btn btn-primary" >Save</a> <a href="javascript:void(0);" className="btn btn-default" >Cancel</a>
                </div>
            </Panel>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}