var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var If = require('./if-else.jsx');
var marked = require('marked');


var FilePreview = React.createClass({
    createMarkup : function() { 
        return {__html: marked(this.props.fileContent || "")}; 
    },
    render:function(){
        return <Panel title={toDisplayName(this.props.file.name)}>
            <div style={{overflow:"auto", height:"80vh"}}>
                <If test={this.props.loading}>
                    <span>Loading...</span>
                    <div  dangerouslySetInnerHTML={this.createMarkup()}></div>
                </If>
            </div>
            <div>
                <a href={`#/edit/${this.props.file.path_lower}`} className="btn btn-primary">Edit</a>
            </div>
        </Panel>
    }

});


module.exports = React.createClass({
    getInitialState:function(){
        return {
            fileContent : this.props.fileContent
        }
    },


    render:function(){
        return <Page>
            <Panel title="Edit">
                <div>
                    <textarea>{this.state.fileContent}</textarea>
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