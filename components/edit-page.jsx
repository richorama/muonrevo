var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var If = require('./if-else.jsx');
var marked = require('marked');
var Monaco = require('react-monaco-editor').default;
var storage = require('../lib/storage');

module.exports = React.createClass({

    handleChange : function(value){
        this.props.onUpdate({content : value});
    },

    render:function(){
        
        return <Page>
            <Panel title={toDisplayName(this.props.fileName)} noPadding={true}>
                <div>
                    <Monaco
                        height={window.innerHeight - 160}
                        value={this.props.fileContent || ""}
                        theme={storage.get("editor-theme") || "vs"}
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