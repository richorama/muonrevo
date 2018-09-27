var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var Monaco = require('react-monaco-editor').default;
var storage = require('../lib/storage');
var eventThing = require('eventthing');

module.exports = React.createClass({

    getInitialState:function(){
        return {
            title : this.props.title || "",
            content : this.props.fileContent || "",
            height : window.innerHeight - 200
        }
    },

    fullscreenRequested : false,

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
        eventThing.on("fullscreen", this.handleFullscreen);
    },

    componentWillUnmount:function(){
        window.removeEventListener("resize", this.handleResize);
        eventThing.clear("fullscreen", this.handleFullscreen);
    },

    handleFullscreen:function(){
        if (this.refs.editContainer.requestFullscreen){
            this.refs.editContainer.requestFullscreen();
        } else if (this.refs.editContainer.webkitRequestFullscreen){
            this.refs.editContainer.webkitRequestFullscreen();
        }
        // don't add the margin on the next resize
        this.fullscreenRequested = true;
    },

    handleResize:function(){
        this.setState({
            height : window.innerHeight - (this.fullscreenRequested ? 0 : 200)
        }, () => this.editor.layout());
        this.fullscreenRequested = false;
    },

    render:function(){
        
        return <Page>
            <Panel title="Add a new entry" noPadding={true}>
                <div>

                    <div>
                        <input className="form-control input-lg" type="text" placeholder="Enter a title..." value={this.state.title} onChange={this.handleTitleChange} ref="title" />
                    </div>

                    <div ref="editContainer">
                        <Monaco
                            height={this.state.height}
                            value={this.state.content || ""}
                            theme={storage.get("editor-theme") || "vs"}
                            language="markdown"
                            options={{selectOnLineNumbers: true, lineNumbers:false, renderLineHighlight : "none", fontSize:18}}
                            onChange={this.handleChange} 
                            editorDidMount={this.handleEditorMount} />
                    </div>
                </div>
            </Panel>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}