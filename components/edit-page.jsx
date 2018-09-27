var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var Monaco = require('react-monaco-editor').default;
var storage = require('../lib/storage');
var eventThing = require('eventthing');

module.exports = React.createClass({

    getInitialState:function(){
        this.content = this.props.fileContent || "";
        return {
            height : window.innerHeight - 160
        }
    },

    fullscreenRequested : false,

    handleChange : function(value){
        this.props.onUpdate({content : value});
        this.content = value;
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
            height : window.innerHeight - (this.fullscreenRequested ? 0 : 160)
        }, () => this.editor.layout());
        this.fullscreenRequested = false;
    },

    getStyle : function(){
        if (this.props.fullscreen){
            return {
                width:window.innerWidth
            };
            return {
                position: "fixed",
                top: 0,
                zIndex: 10000,
                left: 0,
                width:window.innerWidth
            };
        }
        return {};
    },

    render:function(){
        return <Page>
            <Panel title={toDisplayName(this.props.fileName)} noPadding={true}>
                <div ref="editContainer" style={this.getStyle()}>
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