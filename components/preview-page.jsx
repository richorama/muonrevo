var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var renderContent = require('../lib/renderContent');

module.exports = React.createClass({
 
    createMarkup : function() { 
        return {__html: renderContent(this.props.fileContent)}; 
    },

    render:function(){
        return <Page>
            <Panel title={toDisplayName(this.props.fileName)} noPadding={true}>
                <div style={{overflow:"auto", height:"calc(100vh - 150px)", margin:"20px"}}>
                    <div dangerouslySetInnerHTML={this.createMarkup()}></div>
                </div>
            </Panel>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}