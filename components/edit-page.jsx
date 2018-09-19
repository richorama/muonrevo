var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var Monaco = require('react-monaco-editor').default;
var storage = require('../lib/storage');

module.exports = React.createClass({

    getInitialState:function(){
        this.content = this.props.fileContent || "";
        return {
            height : window.innerHeight - 160
        }
    },

    handleChange : function(value){
        this.props.onUpdate({content : value});
        this.content = value;
    },

    handleEditorMount:function(editor){
        this.editor = editor;
    },

    componentDidMount:function(){
        window.addEventListener("resize", this.handleResize);
    },

    componentWillUnmount:function(){
        window.removeEventListener("resize", this.handleResize);
    },

    handleResize:function(){
        this.setState({
            height : window.innerHeight - 160
        }, () => this.editor.layout());
    },


    render:function(){
        return <Page>
            <Panel title={toDisplayName(this.props.fileName)} noPadding={true}>
                <div>
                    <Monaco
                        height={this.state.height}
                        value={this.content}
                        theme={storage.get("editor-theme") || "vs"}
                        language="markdown"
                        options={{selectOnLineNumbers: true, lineNumbers:false, renderLineHighlight : "none", fontSize:18}}
                        onChange={this.handleChange}
                        editorDidMount={this.handleEditorMount}
                        />
                </div>
            </Panel>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}