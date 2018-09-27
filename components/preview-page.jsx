var React = require('react');
var Page = require('./page.jsx');
var Panel = require('./panel.jsx');
var renderContent = require('../lib/renderContent');
var eventThing = require('eventthing');

module.exports = React.createClass({
 
    createMarkup : function() { 
        return {__html: renderContent(this.props.fileContent)}; 
    },

    componentDidMount:function(){
        eventThing.on("fullscreen", this.handleFullscreen);
    },

    componentWillUnmount:function(){
        eventThing.clear("fullscreen", this.handleFullscreen);
    },

    handleFullscreen:function(){
        if (this.refs.editContainer.requestFullscreen){
            this.refs.editContainer.requestFullscreen();
            return;
        }
        if (this.refs.editContainer.webkitRequestFullscreen){
            this.refs.editContainer.webkitRequestFullscreen();
            return;
        }
    },

    render:function(){
        return <Page>
            <Panel title={toDisplayName(this.props.fileName)} noPadding={true}>
                <div ref="editContainer" style={{overflow:"auto", height:"calc(100vh - 150px)", margin:"20px", background:"white"}}>
                    <div dangerouslySetInnerHTML={this.createMarkup()}></div>
                </div>
            </Panel>
        </Page>
    }
});

function toDisplayName(value){
    return (value || "").replace(".md", "");
}