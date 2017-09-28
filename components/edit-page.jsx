var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var If = require('./if-else.jsx');
var marked = require('marked');
var Monaco = require('react-monaco-editor').default;



module.exports = React.createClass({

    handleChange : function(value){
        this.props.onUpdate({content : value});
    },

    render:function(){
        
        return <Page>
            <Panel title={toDisplayName(this.props.fileName)}>
                <div>
                    <Monaco
                        height="500"
                        value={this.props.fileContent || ""}
                        theme="vs-dark"
                        language="markdown"
                        options={{selectOnLineNumbers: true, lineNumbers:false, renderLineHighlight : "none", fontSize:18}}
                        onChange={this.handleChange} />
                </div>
            </Panel>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}