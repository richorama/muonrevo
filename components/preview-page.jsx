var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var marked = require('marked');

module.exports = React.createClass({
 
    createMarkup : function() { 
        return {__html: marked(this.props.fileContent || "")}; 
    },

    render:function(){
        return <Page>
            <Panel title={toDisplayName(this.props.fileName)}>
                <div style={{overflow:"auto", height:"80vh"}}>
                    <div dangerouslySetInnerHTML={this.createMarkup()}></div>
                </div>
            </Panel>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}