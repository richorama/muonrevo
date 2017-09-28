var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var If = require('./if-else.jsx');
var marked = require('marked');
var Monaco = require('react-monaco-editor').default;

module.exports = React.createClass({

    getInitialState:function(){
        return {
            title : this.props.title || "",
            content : this.props.fileContent || ""
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

    render:function(){
        
        return <Page>
            <Panel title="Add a new entry">
                <div>

                    <div>
                        <input style={{marginBottom:"10px"}} className="form-control input-lg" type="text" placeholder="Enter a title..." value={this.state.title} onChange={this.handleTitleChange} ref="title" />
                    </div>

                    <Monaco
                        height="500"
                        value={this.state.content || ""}
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