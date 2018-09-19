var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var Monaco = require('react-monaco-editor').default;
var storage = require('../lib/storage');

module.exports = React.createClass({

    getInitialState:function(){
        return {
            title : this.props.title || "",
            content : this.props.fileContent || "",
            height : window.innerHeight - 200
        }
    },

    updateParent:function(){
        this.props.onUpdate(this.state)
    },

    handleChange : function(value){
        this.setState({content : value}, this.updateParent)
    },

    handleTitleChange:function(){
        this.setState({title:this.refs.title.value}, this.updateParent);
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
            height : window.innerHeight - 200
        }, () => this.editor.layout());
    },

    render:function(){
        
        return <Page>
            <Panel title="Add a new entry" noPadding={true}>
                <div>

                    <div>
                        <input className="form-control input-lg" type="text" placeholder="Enter a title..." value={this.state.title} onChange={this.handleTitleChange} ref="title" />
                    </div>

                    <Monaco
                        height={this.state.height}
                        value={this.state.content || ""}
                        theme={storage.get("editor-theme") || "vs"}
                        language="markdown"
                        options={{selectOnLineNumbers: true, lineNumbers:false, renderLineHighlight : "none", fontSize:18}}
                        onChange={this.handleChange} 
                        editorDidMount={this.handleEditorMount} />
                </div>
            </Panel>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}